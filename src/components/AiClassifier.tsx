import React, { useState } from 'react';
import { Upload, Sparkles, Folder, ExternalLink, AlertCircle, CheckCircle, RefreshCw, Eye } from 'lucide-react';

interface Prediction {
  label: string;
  confidence: number;
}

interface ClassificationResult {
  ok: boolean;
  task: string;
  identified: boolean;
  label: string;
  confidence: number;
  scientificName?: string;
  details?: string;
  healthAssessment?: string;
  alternativePredictions?: Prediction[];
  driveFolder: string;
  fileId: string;
  fileUrl: string;
  folderUrl: string;
  timestamp: string;
}

const SAMPLE_SPECIMENS = [
  {
    name: 'Atrophaneura semperi (Batwing)',
    task: 'species',
    desc: 'Adult female Batwing with scarlet torso and black wings',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%231a1a2e"/><ellipse cx="100" cy="80" rx="75" ry="50" fill="%237b2d26" stroke="%23e8b04a" stroke-width="4" transform="rotate(-20 100 80)"/><ellipse cx="200" cy="80" rx="75" ry="50" fill="%237b2d26" stroke="%23e8b04a" stroke-width="4" transform="rotate(20 200 80)"/><ellipse cx="110" cy="140" rx="50" ry="40" fill="%237b2d26" stroke="%23e8b04a" stroke-width="4"/><ellipse cx="190" cy="140" rx="50" ry="40" fill="%237b2d26" stroke="%23e8b04a" stroke-width="4"/><rect x="144" y="40" width="12" height="120" rx="6" fill="%23d62020"/><circle cx="150" cy="35" r="8" fill="%23222"/><text x="150" y="185" fill="%23fff" font-size="12" text-anchor="middle" font-family="sans-serif">Butterfly-Batwing</text></svg>'
  },
  {
    name: 'Papilio palinurus (Emerald Swallowtail)',
    task: 'species',
    desc: 'Vibrant green shimmering wing scales',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%230f2017"/><ellipse cx="100" cy="80" rx="75" ry="50" fill="%231b3a2a" stroke="%233ddc84" stroke-width="5" transform="rotate(-20 100 80)"/><ellipse cx="200" cy="80" rx="75" ry="50" fill="%231b3a2a" stroke="%233ddc84" stroke-width="5" transform="rotate(20 200 80)"/><ellipse cx="110" cy="140" rx="50" ry="40" fill="%231b3a2a" stroke="%233ddc84" stroke-width="4"/><ellipse cx="190" cy="140" rx="50" ry="40" fill="%231b3a2a" stroke="%233ddc84" stroke-width="4"/><rect x="145" y="40" width="10" height="120" rx="5" fill="%23222"/><text x="150" y="185" fill="%233ddc84" font-size="12" text-anchor="middle" font-family="sans-serif">Emerald Swallowtail</text></svg>'
  },
  {
    name: 'Fresh Export Grade Chrysalis',
    task: 'defect',
    desc: 'Healthy pupa, firm cuticle, cremaster fully intact',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%2316221c"/><path d="M150 20 C185 45 190 120 150 175 C110 120 115 45 150 20Z" fill="%234ade80" stroke="%2315803d" stroke-width="4"/><path d="M130 65 Q150 75 170 65 M125 100 Q150 115 175 100 M135 135 Q150 145 165 135" stroke="%23166534" stroke-width="3" fill="none"/><circle cx="150" cy="18" r="4" fill="%2314532d"/><text x="150" y="192" fill="%2386efac" font-size="12" text-anchor="middle" font-family="sans-serif">Normal Export Grade Pupa</text></svg>'
  },
  {
    name: 'Larva 4th Instar with NPV',
    task: 'disease',
    desc: 'Larval flaccidity and inverted V hang symptom',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%232b1b17"/><path d="M120 40 Q150 20 180 70 Q160 120 140 160" stroke="%23854d0e" stroke-width="26" stroke-linecap="round" fill="none"/><circle cx="120" cy="40" r="14" fill="%23451a03"/><text x="150" y="190" fill="%23fca5a5" font-size="12" text-anchor="middle" font-family="sans-serif">NPV Viral Infection</text></svg>'
  }
];

export const AiClassifier: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<string>('species');
  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_SPECIMENS[0].dataUrl);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const runClassification = async () => {
    if (!imagePreview) {
      setError('Please select or upload a specimen image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: selectedTask,
          image: imagePreview,
          mime: 'image/jpeg'
        })
      });

      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        throw new Error(data.error || 'Classification failed.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with classification model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Live AI Vision & Drive Classifier
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Specimen Analysis & Dataset Collector
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-2xl">
              Upload a photograph of a butterfly, pupa, or caterpillar. The model identifies the specimen across 5 specialized tasks, assigns the confidence score, and stores it in your Google Drive dataset directory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Task:</span>
            <select
              value={selectedTask}
              onChange={(e) => {
                setSelectedTask(e.target.value);
                setResult(null);
              }}
              className="bg-purple-50 border border-purple-200 text-purple-900 font-semibold text-xs md:text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              <option value="species">🦋 Species Identification</option>
              <option value="stage">🔄 Lifecycle Stage</option>
              <option value="disease">🦠 Larval Disease Detection</option>
              <option value="instar">🐛 Larvae Instar (1st-5th)</option>
              <option value="defect">🔍 Pupae Defect Analysis</option>
            </select>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
            Or test with a sample specimen:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SAMPLE_SPECIMENS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setImagePreview(sample.dataUrl);
                  setSelectedTask(sample.task);
                  setResult(null);
                  setError(null);
                }}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  imagePreview === sample.dataUrl
                    ? 'border-purple-500 bg-purple-50/70 text-purple-900 font-semibold shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-bold truncate">{sample.name}</div>
                <div className="text-[11px] text-gray-500 truncate">{sample.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Classifier Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Image Upload & Preview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Specimen Image</h3>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-semibold cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-slate-900 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Specimen Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center text-gray-400 p-4">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p className="text-xs">Select or upload a specimen photo</p>
              </div>
            )}
          </div>

          <button
            onClick={runClassification}
            disabled={loading || !imagePreview}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Specimen with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Classification & Save to Drive
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Analysis & Drive Save Details */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Classification Results</h3>
              {result && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Identified
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-4 mt-4">
                {/* Primary Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                        Top Prediction
                      </span>
                      <h4 className="text-lg font-extrabold text-gray-900">{result.label}</h4>
                      {result.scientificName && (
                        <p className="text-xs italic text-gray-600 font-serif">
                          {result.scientificName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-purple-700">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-gray-500 block">Confidence</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-purple-200/60 text-xs text-gray-700 leading-relaxed">
                    <strong>Observations:</strong> {result.details}
                  </div>

                  {result.healthAssessment && (
                    <div className="mt-2 text-xs text-purple-950 bg-white/70 rounded-lg p-2 border border-purple-100">
                      <strong>Assessment:</strong> {result.healthAssessment}
                    </div>
                  )}
                </div>

                {/* Google Drive Directory Path */}
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-purple-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-yellow-400" /> Google Drive Dataset Routing
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
                  </div>

                  <div className="bg-black/40 p-2.5 rounded-lg font-mono text-[11px] text-emerald-300 break-all select-all">
                    📁 {result.driveFolder}/{result.label}_{result.timestamp}.jpg
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    <a
                      href={result.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-white underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View Photo
                    </a>
                    <span className="text-gray-600">•</span>
                    <a
                      href={result.folderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-white underline inline-flex items-center gap-1"
                    >
                      <Folder className="w-3 h-3" /> Open Drive Folder
                    </a>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">ID: {result.fileId}</span>
                  </div>
                </div>

                {/* Alternative Candidates */}
                {result.alternativePredictions && result.alternativePredictions.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                      Alternative Model Candidates
                    </span>
                    <div className="space-y-1.5">
                      {result.alternativePredictions.map((alt, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="font-medium text-gray-700">{alt.label}</span>
                          <span className="font-mono text-gray-500">{(alt.confidence * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Folder className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">Run a classification to see diagnosis & Drive directory routing</p>
              </div>
            )}
          </div>

          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-xs text-purple-900">
            <strong>Dataset Architecture:</strong> Each classified photo automatically categorizes into your Google Drive root folder <code className="bg-white px-1 rounded font-mono">Butterfly Dataset</code> under the task's corresponding subfolder.
          </div>
        </div>
      </div>
    </div>
  );
};
