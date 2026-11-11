import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Allow large image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI();

const TASKS: Record<string, { folder: string; analysis: string; promptDesc: string }> = {
  species: {
    folder: 'butterfly_species',
    analysis: 'Species Identification',
    promptDesc: 'Identify the exact butterfly species among Philippine species such as Butterfly-Batwing, Butterfly-Clippers, Butterfly-Common Jay, Butterfly-Common Lime, Butterfly-Common Mime, Butterfly-Common Mormon, Butterfly-Emerald Swallowtail, Butterfly-Giant Silk Moth, Butterfly-Golden Birdwing, Butterfly-Great Eggfly, Butterfly-Great Yellow Mormon, Butterfly-Grey Glassy Tiger, Butterfly-Paper Kite, Butterfly-Pink Rose, Butterfly-Plain Tiger, Butterfly-Red Lacewing, Butterfly-Scarlet Mormon, Butterfly-Tailed Jay. Output the standard prefixed name (e.g. "Butterfly-Batwing") or scientific name if different.'
  },
  stage: {
    folder: 'butterfly_stages',
    analysis: 'Lifecycle Stage',
    promptDesc: 'Determine the lifecycle stage: "Egg", "Larva" (Caterpillar), "Pupa" (Chrysalis), or "Adult" (Butterfly / Imago).'
  },
  disease: {
    folder: 'larval_diseases',
    analysis: 'Larval Disease Detection',
    promptDesc: 'Analyze the larva/specimen for diseases: "Healthy", "NPV (Nuclear Polyhedrosis Virus / Melting)", "Bacterial Septicemia / Flacherie", "Fungal Muscardine", or "Parasitoid Attack".'
  },
  instar: {
    folder: 'larvae_instars',
    analysis: 'Larvae Instar',
    promptDesc: 'Identify the caterpillar instar: "1st Instar", "2nd Instar", "3rd Instar", "4th Instar", or "5th Instar (Prepupal)".'
  },
  defect: {
    folder: 'pupae_defects',
    analysis: 'Pupae Defect Analysis',
    promptDesc: 'Inspect the pupa for export quality: "Export Grade (Normal / Healthy)", "Cremaster Detachment", "Parasitoid Wasp Puncture Hole", "Mechanical Deformation / Bruising", or "Fungal / Mold Infestation".'
  }
};

// API Route: AI Classification using Gemini Vision
app.post('/api/classify', async (req, res) => {
  try {
    const { task = 'species', image, mime = 'image/jpeg' } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data received.' });
    }

    const taskInfo = TASKS[task] || TASKS.species;
    const base64Data = image.replace(/^data:[^;]+;base64,/, '');

    const prompt = `You are an expert lepidopterist and entomology computer vision classifier.
Analyze this butterfly/larva/pupa image specifically for task: "${taskInfo.analysis}".
Context & Requirement:
${taskInfo.promptDesc}

Return a valid JSON object matching this schema:
{
  "identified": boolean (true if recognizable with reasonable confidence >= 0.5, false if blurry or unrelated),
  "label": string (primary label, matching the task guidelines),
  "confidence": number (between 0.0 and 1.0),
  "scientificName": string (scientific binomial name if applicable, or empty string),
  "details": string (1-2 sentences highlighting diagnostic anatomical features, e.g. cremaster, wing margins, spots, setae, coloration),
  "healthAssessment": string (quality check, defect notes, or agricultural advice),
  "alternativePredictions": [
    { "label": string, "confidence": number }
  ]
}
Do not wrap in markdown quotes if possible, return strictly parseable JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mime
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error('Failed to parse classification result JSON');
    }

    const safeLabel = (parsed.label || 'Unknown').replace(/[\\/:*?"<>|]/g, '_').trim();
    const driveFolder = `Butterfly Dataset/${taskInfo.folder}/${safeLabel}`;
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const simulatedFileId = 'drive_' + crypto.randomBytes(8).toString('hex');
    const simulatedFileUrl = `https://drive.google.com/file/d/${simulatedFileId}/view`;
    const simulatedFolderUrl = `https://drive.google.com/drive/folders/folder_${crypto.randomBytes(6).toString('hex')}`;

    return res.json({
      ok: true,
      task,
      identified: !!parsed.identified,
      label: safeLabel,
      confidence: Number(parsed.confidence) || 0.85,
      scientificName: parsed.scientificName || '',
      details: parsed.details || 'Specimen analyzed successfully.',
      healthAssessment: parsed.healthAssessment || 'Normal condition.',
      alternativePredictions: parsed.alternativePredictions || [],
      driveFolder,
      fileId: simulatedFileId,
      fileUrl: simulatedFileUrl,
      folderUrl: simulatedFolderUrl,
      timestamp
    });
  } catch (error: any) {
    console.error('Classification error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Error occurred during image classification'
    });
  }
});

// API Route: Test CNN Model Server URL & Token
app.post('/api/test-cnn', async (req, res) => {
  try {
    const { url, token } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Please enter CNN_API_URL.' });
    }

    const cleanUrl = url.trim().replace(/\/+$/, '');
    const startTime = Date.now();

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'ButterflyShop-AppScript/1.0'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let statusResp;
    try {
      statusResp = await fetch(`${cleanUrl}/api/cnn/status`, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
    } catch (e: any) {
      clearTimeout(timeoutId);
      // Fallback try ping or root
      try {
        const pingResp = await fetch(`${cleanUrl}/`, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(6000)
        });
        const latency = Date.now() - startTime;
        return res.json({
          ok: pingResp.status >= 200 && pingResp.status < 400,
          status: pingResp.status,
          latencyMs: latency,
          message: `Endpoint reachable (${pingResp.status}), but /api/cnn/status not standard.`,
          data: { status: 'online', code: pingResp.status }
        });
      } catch (err2: any) {
        return res.json({
          ok: false,
          error: `Could not reach ${cleanUrl}: ${e.name === 'AbortError' ? 'Connection timed out (12s). Server might be sleeping on free tier.' : e.message}`,
          isTimeout: e.name === 'AbortError'
        });
      }
    }

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    const isOk = statusResp.status === 200;
    let data = null;
    try {
      data = await statusResp.json();
    } catch {
      data = await statusResp.text();
    }

    return res.json({
      ok: isOk,
      status: statusResp.status,
      latencyMs: latency,
      message: isOk ? 'CNN Model Server online and authenticated!' : `Server returned HTTP ${statusResp.status}`,
      data
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Failed to test CNN connection'
    });
  }
});

// API Route: Generate cryptographic CNN API Token
const handleGenerateToken = (req: express.Request, res: express.Response) => {
  const token = 'cnn_' + crypto.randomBytes(24).toString('hex');
  res.json({
    token,
    created: new Date().toISOString(),
    instructions: [
      '1. In Google Apps Script: Go to Project Settings > Script properties > Add CNN_API_TOKEN with this value.',
      '2. In your Model Server (Render / Railway / Colab / VPS): Set environment variable API_TOKEN with this exact value.',
      '3. In Google Drive: Ensure Butterfly Dataset folder is created or use the automatic setup in Classification.gs.'
    ]
  });
};
app.post('/api/generate-token', handleGenerateToken);
app.get('/api/generate-token', handleGenerateToken);

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
