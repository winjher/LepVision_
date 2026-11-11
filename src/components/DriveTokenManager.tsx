import React, { useState } from 'react';
import { Key, HardDrive, Shield, Check, Copy, RefreshCw, AlertCircle, CheckCircle2, ExternalLink, Sparkles, Folder } from 'lucide-react';

export const DriveTokenManager: React.FC = () => {
  const [token, setToken] = useState<string>('cnn_9e81b2c73041a9d821e4f9b8c0a21d7e5f39a04b12c8e7d4');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('https://lepvision-api.onrender.com');
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    loading: boolean;
    ok: boolean;
    latencyMs?: number;
    message?: string;
    error?: string;
  }>({
    tested: false,
    loading: false,
    ok: false
  });

  const generateNewToken = async () => {
    try {
      const resp = await fetch('/api/generate-token', { method: 'POST' });
      const data = await resp.json();
      if (data.token) {
        setToken(data.token);
      }
    } catch {
      // Fallback local random hex
      const randHex = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setToken('cnn_' + randHex);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const testConnection = async () => {
    setTestStatus({ tested: false, loading: true, ok: false });
    try {
      const resp = await fetch('/api/test-cnn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: apiUrl, token })
      });
      const data = await resp.json();
      setTestStatus({
        tested: true,
        loading: false,
        ok: !!data.ok,
        latencyMs: data.latencyMs,
        message: data.message,
        error: data.error
      });
    } catch (e: any) {
      setTestStatus({
        tested: true,
        loading: false,
        ok: false,
        error: e.message || 'Network error reaching test endpoint'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg border border-purple-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Key className="w-4 h-4 text-amber-300" /> Model Authentication & Drive Setup
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Get CNN Token & Configure Drive Directory
            </h2>
            <p className="text-purple-200 text-xs md:text-sm mt-1 max-w-2xl">
              Connect your Google Apps Script project with your CNN deep learning server and Google Drive dataset directory.
            </p>
          </div>
          <button
            onClick={generateNewToken}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer w-fit"
          >
            <Sparkles className="w-4 h-4" /> Generate New CNN Token
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CNN API Token & Server Connection */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-gray-900 text-base">CNN Model Server Token</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Your Secret CNN API Token (<code className="text-purple-700">CNN_API_TOKEN</code>):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={token}
                className="w-full font-mono text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 select-all"
              />
              <button
                onClick={copyToken}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  copiedToken
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                }`}
              >
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedToken ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              Copy this token into Google Apps Script <strong>Project Settings &gt; Script properties</strong> as <code className="bg-gray-100 px-1 font-mono">CNN_API_TOKEN</code>.
            </p>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Model Server URL (<code className="text-purple-700">CNN_API_URL</code>):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://lepvision-api.onrender.com"
                className="w-full font-mono text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={testConnection}
                disabled={testStatus.loading}
                className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5"
              >
                {testStatus.loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <HardDrive className="w-3.5 h-3.5" />}
                Test
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              Enter the base URL without trailing slashes. Example: <code className="bg-gray-100 px-1 font-mono">https://lepvision-api.onrender.com</code>
            </p>
          </div>

          {/* Test Status Feedback */}
          {testStatus.tested && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                testStatus.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              {testStatus.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-bold">
                  {testStatus.ok ? 'Connection Successful!' : 'Connection Note / Offline'}
                </strong>
                <p className="mt-0.5 leading-relaxed">
                  {testStatus.message || testStatus.error}
                </p>
                {testStatus.latencyMs !== undefined && (
                  <span className="inline-block mt-1 text-[11px] font-mono text-gray-500">
                    Latency: {testStatus.latencyMs}ms
                  </span>
                )}
                {!testStatus.ok && (
                  <p className="mt-1 text-[11px] text-gray-600">
                    💡 <strong>Tip:</strong> If your server is hosted on Render free tier, it sleeps after inactivity and takes ~50 seconds to wake up. With our fixed code, Apps Script will seamlessly use the Gemini API fallback if the CNN server doesn't respond!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Directory Structure */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-gray-900 text-base">Google Drive Dataset Hierarchy</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Auto-Provisioned
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            In the original code, the folder ID <code className="text-red-600 font-mono bg-red-50 px-1 rounded">1vF4pPNKDG...</code> was hardcoded, causing a fatal permission error on your Drive. The fixed code automatically provisions this folder tree in your root Google Drive:
          </p>

          <div className="bg-slate-900 text-white rounded-xl p-4 text-xs font-mono space-y-2 border border-gray-800">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              📁 My Drive /
            </div>
            <div className="pl-4 text-emerald-300 font-bold flex items-center gap-1.5">
              └── 📁 Butterfly Dataset/ <span className="text-gray-400 font-normal text-[10px]">(Root Folder)</span>
            </div>
            <div className="pl-8 space-y-1 text-gray-300 text-[11px]">
              <div>├── 📁 butterfly_species/ <span className="text-purple-400"># 18 species subfolders</span></div>
              <div>├── 📁 butterfly_stages/ <span className="text-purple-400"># Egg, Larva, Pupa, Adult</span></div>
              <div>├── 📁 larval_diseases/ <span className="text-purple-400"># Healthy, NPV, Bacterial, Fungal</span></div>
              <div>├── 📁 larvae_instars/ <span className="text-purple-400"># 1st to 5th instars</span></div>
              <div>├── 📁 pupae_defects/ <span className="text-purple-400"># Normal, Cremaster, Parasitoid</span></div>
              <div>└── 📁 images/ <span className="text-purple-400"># Public marketplace photos</span></div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 text-xs text-purple-900 space-y-1.5">
            <div className="font-bold text-purple-950 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-purple-600" /> Automatic Script Properties Detection:
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              When <code className="bg-white px-1 rounded font-mono">setupDriveDirectory()</code> or <code className="bg-white px-1 rounded font-mono">classifyAndSave()</code> runs, it creates the folder on your own Drive and automatically saves the new folder ID into <code className="bg-white px-1 rounded font-mono">PropertiesService.ROOT_FOLDER_ID</code> for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
