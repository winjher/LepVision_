import React, { useState } from 'react';
import { FIXED_CLASSIFICATION_GS, APPSSCRIPT_JSON } from '../data/appScriptSource';
import { FIXED_CODE_GS } from '../data/fixedCodeGs';
import { FIXED_INDEX_HTML, FIXED_DASHBOARD_HTML } from '../data/fixedTemplates';
import { Check, Copy, Download, FileCode, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  code: string;
}

const FILES: FileItem[] = [
  {
    id: 'classification',
    name: 'Classification.gs',
    badge: 'Fixed (Primary)',
    description: 'Dynamic Google Drive resolution without dead folder ID, automatic CNN token handling, Gemini fallback & label exports.',
    code: FIXED_CLASSIFICATION_GS
  },
  {
    id: 'code',
    name: 'Code.gs',
    badge: 'Fixed (Backend)',
    description: 'Full spreadsheet database backend, doPost dispatch for all classification methods, authentication & order pipeline.',
    code: FIXED_CODE_GS
  },
  {
    id: 'index',
    name: 'Index.html',
    badge: 'Enhanced UI',
    description: 'Web app UI template with Google Drive folder link rendering, confidence display, and realtime shop.',
    code: FIXED_INDEX_HTML
  },
  {
    id: 'dashboard',
    name: 'Dashboard.html',
    badge: 'Admin Panel',
    description: 'Standalone dashboard template for admin monitoring of orders, bookings, inventory, and activity logs.',
    code: FIXED_DASHBOARD_HTML
  },
  {
    id: 'manifest',
    name: 'appsscript.json',
    badge: 'Manifest',
    description: 'Project manifest with Drive, Sheets, External Request, and Mail scopes required for full functionality.',
    code: APPSSCRIPT_JSON
  }
];

export const CodeViewer: React.FC = () => {
  const [activeFileId, setActiveFileId] = useState<string>('classification');
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = FILES.find((f) => f.id === activeFileId) || FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    FILES.forEach((f, idx) => {
      setTimeout(() => {
        const blob = new Blob([f.code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, idx * 150);
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Card: What Was Fixed */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> All Errors Successfully Resolved
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Apps Script Code & Architecture Fixes
            </h2>
          </div>
          <button
            onClick={handleDownloadAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer w-fit"
          >
            <Download className="w-4 h-4" /> Download All 5 Files
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs md:text-sm">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> 1. Dead Drive Folder ID Fixed
            </span>
            <p className="text-purple-200/80 leading-relaxed">
              Replaced hardcoded <code className="text-pink-300 font-mono bg-black/30 px-1 rounded">1vF4pPNKDG...</code> with self-healing <code className="text-cyan-300 font-mono bg-black/30 px-1 rounded">clsGetRootFolder_()</code> which automatically creates or locates <strong className="text-white">"Butterfly Dataset"</strong> directly in your own Google Drive!
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> 2. CNN Token & API Fallback
            </span>
            <p className="text-purple-200/80 leading-relaxed">
              Added programmatic token getters, bearer authorization headers, automated retry on cold-starts, and seamless Gemini Vision fallback if your CNN server is sleeping.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> 3. Missing writeLabelFiles Fixed
            </span>
            <p className="text-purple-200/80 leading-relaxed">
              Implemented the missing <code className="text-amber-300 font-mono bg-black/30 px-1 rounded">writeLabelFiles()</code> registered in <code className="font-mono text-purple-200">doPost</code>, which outputs <code className="text-purple-200 font-mono">labels.txt</code> for ML dataset training.
            </p>
          </div>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILES.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:border-purple-200'
              }`}
            >
              <FileCode className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-600'}`} />
              <span>{file.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isActive ? 'bg-purple-800 text-purple-200' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {file.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active File Header & Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-base">{activeFile.name}</h3>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-md">
              {activeFile.badge}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5">{activeFile.description}</p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownloadSingle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Code Display Area with Syntax Styling */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-gray-800 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-mono text-gray-300 font-medium">{activeFile.name}</span>
          </div>
          <span className="font-mono text-gray-500">
            {activeFile.code.split('\n').length} lines
          </span>
        </div>

        <div className="overflow-x-auto max-h-[580px] p-4 text-xs font-mono text-gray-200 leading-relaxed selection:bg-purple-700 selection:text-white">
          <pre>
            <code>{activeFile.code}</code>
          </pre>
        </div>
      </div>

      {/* How to paste into Google Apps Script */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-950">How to update your Apps Script project:</span>
          <p className="leading-relaxed">
            1. Open your Google Sheet <ArrowRight className="inline w-3 h-3 mx-1" /> Click <strong>Extensions</strong> <ArrowRight className="inline w-3 h-3 mx-1" /> <strong>Apps Script</strong>.<br />
            2. Replace the contents of <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">Classification.gs</code> and <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">Code.gs</code> with the code above.<br />
            3. In Project Settings (gear icon), set your Script properties: <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">CNN_API_URL</code> and <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">CNN_API_TOKEN</code> (you can leave <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">ROOT_FOLDER_ID</code> blank to auto-create "Butterfly Dataset" in your Drive).<br />
            4. Click <strong>Deploy</strong> <ArrowRight className="inline w-3 h-3 mx-1" /> <strong>Manage deployments</strong> <ArrowRight className="inline w-3 h-3 mx-1" /> Edit <ArrowRight className="inline w-3 h-3 mx-1" /> <strong>New version</strong> <ArrowRight className="inline w-3 h-3 mx-1" /> Deploy!
          </p>
        </div>
      </div>
    </div>
  );
};
