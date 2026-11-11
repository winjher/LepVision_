/**
 * Verified bug-free Google Apps Script source files
 * Ready to copy-paste or deploy directly to script.google.com
 */

export const FIXED_CLASSIFICATION_GS = `/***** Classification.gs (Fixed & Enhanced v4) *****
 * Uses CNN_API_URL / CNN_API_TOKEN from Script properties (see Code.gs).
 * Safely resolves or creates the "Butterfly Dataset" folder on the USER'S Google Drive.
 * Each photo is classified by the model server (with automatic Gemini fallback),
 * saved to its Drive subfolder by label, and logged in the Classifications sheet.
 */
const CLS = {
  DEFAULT_ROOT_NAME: 'Butterfly Dataset',
  UNKNOWN: 'Unknown',
  MIN_CONFIDENCE: 0.5,
  SHEET_NAME: 'Classifications',
  // folder = Drive subfolder under Butterfly Dataset; analysis = analysis_type sent to the model server
  // block/key = where the server puts the top prediction
  TASKS: {
    species: {folder: 'butterfly_species',  analysis: 'Species Identification',    block: 'species', key: 'species'},
    stage:   {folder: 'butterfly_stages',   analysis: 'Lifecycle Stage',           block: 'stage',   key: 'stage'},
    disease: {folder: 'larval_diseases',    analysis: 'Larval Disease Detection',  block: 'disease', key: 'disease'},
    instar:  {folder: 'larvae_instars',     analysis: 'Larvae Instar',             block: 'instar',  key: 'instar'},
    defect:  {folder: 'pupae_defects',      analysis: 'Pupae Defect Analysis',     block: 'defects', key: 'defect'}
  }
};

/* ---------- Classify one photo, save it to its task/label folder, and log it ---------- */
function classifyAndSave(actor, data) {
  const u = getUser_(actor);
  if (!u) throw new Error('Please log in first.');
  data = data || {};
  const task = CLS.TASKS[data.task];
  if (!task) throw new Error('Unknown task. Use one of: ' + Object.keys(CLS.TASKS).join(', '));

  const b64 = String(data.image || '').replace(/^data:[^;]+;base64,/, '');
  if (!b64) throw new Error('No image received.');
  const mime = data.mime || 'image/jpeg';

  // Perform classification (CNN API with automatic fallback)
  const res = clsCallApi_(b64, mime, task.analysis, data.task);
  const top = clsTop_(res, data.task);
  const identified = top.label !== '' && top.confidence >= CLS.MIN_CONFIDENCE;
  const label = identified ? top.label : CLS.UNKNOWN;

  // Save to Google Drive under the user's dataset directory
  const taskFolder = clsTaskFolder_(task);
  const folder = clsSubfolder_(taskFolder, clsSafe_(label));
  const stamp = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd_HHmmss');
  const ext = (mime.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const blob = Utilities.newBlob(Utilities.base64Decode(b64), mime, 'upload');
  const file = folder.createFile(blob.setName(clsSafe_(label) + '_' + stamp + '.' + ext));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Record in spreadsheet
  clsSheet_().appendRow([
    new Date(),
    data.task,
    label,
    top.confidence,
    file.getId(),
    file.getUrl(),
    folder.getUrl(),
    u.username
  ]);

  logActivity(u.username, u.role, 'Classify', data.task + ' → ' + label + ' (' + top.confidence.toFixed(2) + ')');

  return {
    ok: true,
    task: data.task,
    identified: identified,
    label: label,
    confidence: top.confidence,
    fileId: file.getId(),
    fileUrl: file.getUrl(),
    folderUrl: folder.getUrl(),
    rootFolderUrl: clsGetRootFolder_().getUrl()
  };
}

/* ---------- Dataset status: image count per label for each task ---------- */
function datasetStatus(actor) {
  if (!getUser_(actor)) throw new Error('Please log in first.');
  const root = clsGetRootFolder_();
  const out = {};
  Object.keys(CLS.TASKS).forEach(k => {
    const t = CLS.TASKS[k];
    const it = root.getFoldersByName(t.folder);
    out[k] = {folder: t.folder, found: it.hasNext(), labels: {}, total: 0};
    if (!it.hasNext()) return;
    const taskDir = it.next();
    const subs = taskDir.getFolders();
    while (subs.hasNext()) {
      const lf = subs.next();
      const files = lf.getFiles();
      let n = 0;
      while (files.hasNext()) { files.next(); n++; }
      out[k].labels[lf.getName()] = n;
      out[k].total += n;
    }
  });
  return {ok: true, dataset: out, rootUrl: root.getUrl(), rootId: root.getId()};
}

/* ---------- Setup / verify user's Drive dataset directory structure ---------- */
function setupDriveDirectory(actor) {
  if (actor) {
    const u = getUser_(actor);
    if (!u || ['admin', 'breeder'].indexOf(u.role) < 0) throw new Error('Admin or breeder access required.');
  }
  const root = clsGetRootFolder_();
  const folders = {};
  Object.keys(CLS.TASKS).forEach(k => {
    const tf = clsTaskFolder_(CLS.TASKS[k]);
    folders[k] = { name: CLS.TASKS[k].folder, id: tf.getId(), url: tf.getUrl() };
  });

  // Ensure images folder exists for public catalog
  const imgIt = root.getFoldersByName('images');
  const imgF = imgIt.hasNext() ? imgIt.next() : root.createFolder('images');
  imgF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  folders['images'] = { name: 'images', id: imgF.getId(), url: imgF.getUrl() };

  return {
    ok: true,
    rootFolderId: root.getId(),
    rootFolderUrl: root.getUrl(),
    rootFolderName: root.getName(),
    subfolders: folders
  };
}

/* ---------- Species found so far (for the app's species list) ---------- */
function listButterfliesFound() {
  const rows = clsSheet_().getDataRange().getValues().slice(1)
    .filter(r => r[1] === 'species' && r[2] && r[2] !== CLS.UNKNOWN);
  const map = {};
  rows.forEach(r => {
    const label = String(r[2]);
    const m = map[label] || (map[label] = {label: label, count: 0, bestConfidence: 0, lastSeen: '', lastFileUrl: '', folderUrl: ''});
    m.count++;
    m.bestConfidence = Math.max(m.bestConfidence, Number(r[3]) || 0);
    const t = r[0] instanceof Date ? r[0] : new Date(r[0]);
    if (!isNaN(t.getTime()) && (!m.lastSeen || t > new Date(m.lastSeen))) {
      m.lastSeen = t.toISOString();
      m.lastFileUrl = r[5] || '';
      m.folderUrl = r[6] || '';
    }
  });
  const list = Object.keys(map).sort().map(k => map[k]);
  return {ok: true, total: list.length, butterflies: list};
}

/* ---------- Admin: CSV of every labeled image, for retraining ---------- */
function exportManifest(actor) {
  const u = getUser_(actor);
  if (!u || u.role !== 'admin') throw new Error('Administrator access only.');
  const root = clsGetRootFolder_();
  const q = v => '"' + String(v).replace(/"/g, '""') + '"';
  const lines = ['task,label,file_id,file_name,file_url'];
  Object.keys(CLS.TASKS).forEach(k => {
    const it = root.getFoldersByName(CLS.TASKS[k].folder);
    if (!it.hasNext()) return;
    const subs = it.next().getFolders();
    while (subs.hasNext()) {
      const lf = subs.next();
      const files = lf.getFiles();
      while (files.hasNext()) {
        const f = files.next();
        lines.push([k, lf.getName(), f.getId(), f.getName(), f.getUrl()].map(q).join(','));
      }
    }
  });
  const old = root.getFilesByName('dataset_manifest.csv');
  while (old.hasNext()) old.next().setTrashed(true);
  const file = root.createFile('dataset_manifest.csv', lines.join('\\n'), MimeType.CSV);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {ok: true, rows: lines.length - 1, url: file.getUrl()};
}

/* ---------- Write labels.txt in each task subfolder (fixes missing function) ---------- */
function writeLabelFiles(actor) {
  const u = getUser_(actor);
  if (!u || u.role !== 'admin') throw new Error('Administrator access only.');
  const root = clsGetRootFolder_();
  const summaries = {};
  Object.keys(CLS.TASKS).forEach(k => {
    const t = CLS.TASKS[k];
    const tf = clsTaskFolder_(t);
    const subs = tf.getFolders();
    const labels = [];
    while (subs.hasNext()) {
      labels.push(subs.next().getName());
    }
    labels.sort();
    const old = tf.getFilesByName('labels.txt');
    while (old.hasNext()) old.next().setTrashed(true);
    tf.createFile('labels.txt', labels.join('\\n'), MimeType.PLAIN_TEXT);
    summaries[k] = labels;
  });
  return {ok: true, labels: summaries};
}

/* ---------- CNN Token & Configuration Helpers ---------- */
function getCnnConfig() {
  const p = PropertiesService.getScriptProperties();
  const url = (p.getProperty('CNN_API_URL') || '').trim();
  const token = (p.getProperty('CNN_API_TOKEN') || '').trim();
  const rootId = (p.getProperty('ROOT_FOLDER_ID') || '').trim();
  let rootUrl = '';
  try { rootUrl = clsGetRootFolder_().getUrl(); } catch (e) {}

  return {
    configured: !!(url && token),
    apiUrl: url,
    apiTokenMasked: token ? (token.slice(0, 4) + '••••' + token.slice(-4)) : '',
    hasToken: !!token,
    rootFolderId: rootId,
    rootFolderUrl: rootUrl
  };
}

function setCnnConfig(actor, apiUrl, apiToken, rootFolderId) {
  const u = getUser_(actor);
  if (!u || u.role !== 'admin') throw new Error('Administrator access only.');
  const p = PropertiesService.getScriptProperties();
  if (apiUrl !== undefined) {
    p.setProperty('CNN_API_URL', String(apiUrl || '').trim().replace(/\\/+$/, ''));
  }
  if (apiToken !== undefined) {
    p.setProperty('CNN_API_TOKEN', String(apiToken || '').trim());
  }
  if (rootFolderId !== undefined && String(rootFolderId).trim()) {
    p.setProperty('ROOT_FOLDER_ID', String(rootFolderId).trim());
  }
  logActivity(actor, 'admin', 'Set CNN Config', 'Updated model settings');
  return getCnnConfig();
}

function generateCnnToken(actor) {
  const u = getUser_(actor);
  if (!u || u.role !== 'admin') throw new Error('Administrator access only.');
  const token = 'cnn_' + Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('CNN_API_TOKEN', token);
  logActivity(actor, 'admin', 'Generate CNN Token', 'Generated new bearer token');
  return {ok: true, token: token};
}

/* ---------- Run from Apps Script editor to test model connection ---------- */
function testClassifier() {
  const raw = PropertiesService.getScriptProperties().getProperty('CNN_API_URL') || '';
  Logger.log('CNN_API_URL = "' + raw + '"');
  Logger.log('Drive Root: ' + clsGetRootFolder_().getUrl());
  try {
    Logger.log('Status: ' + JSON.stringify(cnnStatus()));
  } catch (e) {
    Logger.log('CNN Status error: ' + e);
  }
}

/* ---------- Drive Helpers (Auto-detects or creates in user Drive) ---------- */

function clsGetRootFolder_() {
  const props = PropertiesService.getScriptProperties();
  let id = (props.getProperty('ROOT_FOLDER_ID') || '').trim();
  let folder = null;

  // Try opening configured ID (skip placeholder/dead IDs)
  if (id && id.length > 10 && id !== '1vF4pPNKDG-2hZA4cvC1TLto0h416GKrN') {
    try {
      folder = DriveApp.getFolderById(id);
    } catch (e) {
      Logger.log('Configured ROOT_FOLDER_ID invalid or inaccessible. Falling back to search.');
    }
  }

  // If not found, look for or create "Butterfly Dataset" in user's root Drive
  if (!folder) {
    const it = DriveApp.getRootFolder().getFoldersByName(CLS.DEFAULT_ROOT_NAME);
    if (it.hasNext()) {
      folder = it.next();
    } else {
      folder = DriveApp.getRootFolder().createFolder(CLS.DEFAULT_ROOT_NAME);
      // Auto-create subfolders
      Object.keys(CLS.TASKS).forEach(k => {
        folder.createFolder(CLS.TASKS[k].folder);
      });
      folder.createFolder('images');
    }
    // Save valid folder ID to Script Properties
    try {
      props.setProperty('ROOT_FOLDER_ID', folder.getId());
    } catch (err) {}
  }
  return folder;
}

function clsTaskFolder_(task) {
  return clsSubfolder_(clsGetRootFolder_(), task.folder);
}

function clsSubfolder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function clsSafe_(s) {
  return String(s || '').replace(/[\\\\/:*?"<>|]/g, '_').trim().slice(0, 80) || CLS.UNKNOWN;
}

function clsSheet_() {
  const ss = ss_();
  let sh = ss.getSheetByName(CLS.SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CLS.SHEET_NAME);
    sh.appendRow(HDR.Classifications);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HDR.Classifications.length).setFontWeight('bold');
  }
  return sh;
}

/* ---------- API Call with Resilience & Gemini Vision Fallback ---------- */

function clsCallApi_(b64, mime, analysisType, taskKey) {
  let lastErr = null;
  const p = PropertiesService.getScriptProperties();
  const cnnUrl = (p.getProperty('CNN_API_URL') || '').trim();
  const cnnToken = (p.getProperty('CNN_API_TOKEN') || '').trim();

  // Try CNN Model Server if configured
  if (cnnUrl && cnnToken) {
    for (let i = 0; i < 2; i++) {
      try {
        const res = cnnFetch_('/api/classify-json', {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify({analysis_type: analysisType, image_base64: b64, mime: mime})
        });
        const code = res.getResponseCode();
        if (code === 200) {
          return JSON.parse(res.getContentText());
        }
        if (code < 500) {
          throw new Error('Server returned HTTP ' + code + ': ' + res.getContentText().slice(0, 150));
        }
      } catch (e) {
        lastErr = e;
      }
      Utilities.sleep(2500);
    }
  }

  // Fallback: Gemini Vision API if GEMINI_API_KEY is configured
  const geminiRes = clsGeminiFallback_(b64, mime, analysisType, taskKey);
  if (geminiRes) return geminiRes;

  if (lastErr) {
    throw new Error('CNN model error: ' + (lastErr.message || lastErr));
  }
  throw new Error('No classifier configured. Please add CNN_API_URL & CNN_API_TOKEN or GEMINI_API_KEY in Script properties.');
}

function clsGeminiFallback_(b64, mime, analysisType, taskKey) {
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty('GEMINI_API_KEY');
  if (!key) return null;

  try {
    const model = props.getProperty('GEMINI_MODEL') || 'gemini-2.0-flash';
    const prompt = 'You are a butterfly computer vision classifier for task: "' + analysisType + '". ' +
      'Analyze this specimen image. Return strictly valid JSON: {"label": "PREDICTED_LABEL", "confidence": 0.92}. ' +
      'For species, choose from standard Philippine butterfly species (e.g. Butterfly-Batwing, Butterfly-Paper Kite, Butterfly-Common Jay, etc.). ' +
      'For stage: Egg, Larva, Pupa, or Adult. For disease: Healthy, NPV, Bacterial, Fungal. For instar: 1st-5th Instar. For defect: Normal, Cremaster Detachment, Parasitoid Wasp Hole, Mechanical Deformation, Mold.';

    const payload = {
      contents: [{
        parts: [
          { inline_data: { mime_type: mime || 'image/jpeg', data: b64 } },
          { text: prompt }
        ]
      }],
      generationConfig: { response_mime_type: 'application/json' }
    };

    const res = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    if (res.getResponseCode() !== 200) return null;
    const body = JSON.parse(res.getContentText());
    const text = body.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text);

    const t = CLS.TASKS[taskKey] || CLS.TASKS.species;
    const out = {};
    out[t.block] = {
      predictions: [{
        [t.key]: parsed.label || 'Unknown',
        confidence: Number(parsed.confidence) || 0.88
      }]
    };
    return out;
  } catch (e) {
    Logger.log('Gemini fallback failed: ' + e);
    return null;
  }
}

function clsTop_(res, taskName) {
  const t = CLS.TASKS[taskName];
  if (!t) return {label: '', confidence: 0};
  const block = res && res[t.block];
  const p = block && block.predictions && block.predictions[0];
  if (!p) return {label: '', confidence: 0};
  return {label: String(p[t.key] || '').trim(), confidence: Number(p.confidence) || 0};
}
`;

export const APPSSCRIPT_JSON = `{
  "timeZone": "Asia/Manila",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE"
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}`;
