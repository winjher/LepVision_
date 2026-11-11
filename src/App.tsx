/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCode,
  Sparkles,
  Key,
  ShoppingBag,
  BookOpen,
  HardDrive,
  CheckCircle2,
  ExternalLink,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { CodeViewer } from './components/CodeViewer';
import { AiClassifier } from './components/AiClassifier';
import { DriveTokenManager } from './components/DriveTokenManager';
import { ShopSimulator } from './components/ShopSimulator';
import { SetupGuide } from './components/SetupGuide';

type Tab = 'code' | 'classify' | 'token' | 'shop' | 'guide';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('code');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Global Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-xl shadow-md shadow-purple-500/20">
                🦋
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                    Butterfly Pupae Shop & AI Hub
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    Apps Script v4.2 Fixed
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Drive dataset auto-provisioning · CNN Token Manager · 5-Task AI Classification
                </p>
              </div>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                <HardDrive className="w-3.5 h-3.5 text-purple-600" />
                <span>Drive Auto-Provisioned</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Fatal Errors</span>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs md:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Fixed Code &amp; Manifests</span>
            </button>

            <button
              onClick={() => setActiveTab('classify')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'classify'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Classifier &amp; Drive Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('token')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'token'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>CNN Token &amp; Drive Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'shop'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop &amp; Farm Park Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Deployment Guide</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'classify' && <AiClassifier />}
        {activeTab === 'token' && <DriveTokenManager />}
        {activeTab === 'shop' && <ShopSimulator />}
        {activeTab === 'guide' && <SetupGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Butterfly Pupae Shop &amp; Park · Google Apps Script &amp; Google Drive AI Dataset Integration
          </p>
          <div className="flex items-center gap-4">
            <span className="text-purple-600 font-medium">Philippine Butterfly Breeding Network</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
