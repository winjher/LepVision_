import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, AlertTriangle, Key, HardDrive, ExternalLink } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" />
          Step-by-Step Google Apps Script Setup Guide
        </h2>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Follow these 4 simple steps to deploy your bug-free Butterfly Pupae Shop & AI Classification system.
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
            1
          </span>
          <h3 className="font-bold text-gray-900 text-base">Open Apps Script from Your Google Sheet</h3>
        </div>
        <div className="pl-10 space-y-2 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            1. Open your Google Spreadsheet (e.g., <code className="bg-purple-50 text-purple-800 font-mono px-1.5 py-0.5 rounded">1l7m8mHBNF3kY44Wi-97PIM_AGSc1aywVZK4kT3iZevc</code> or create a new blank Google Sheet).
          </p>
          <p>
            2. In the top Google Sheets menu, click <strong>Extensions &gt; Apps Script</strong>.
          </p>
          <p>
            3. In the left files sidebar of Apps Script, create/open:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><code className="font-mono font-bold text-purple-700">Classification.gs</code> (paste our fixed <code>Classification.gs</code> code)</li>
            <li><code className="font-mono font-bold text-purple-700">Code.gs</code> (paste our fixed <code>Code.gs</code> code)</li>
            <li><code className="font-mono font-bold text-purple-700">Index.html</code> (HTML file)</li>
            <li><code className="font-mono font-bold text-purple-700">Dashboard.html</code> (HTML file)</li>
            <li><code className="font-mono font-bold text-purple-700">appsscript.json</code> (Manifest file; click Project Settings &gt; check "Show 'appsscript.json' manifest file in editor")</li>
          </ul>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
            2
          </span>
          <h3 className="font-bold text-gray-900 text-base">Configure Script Properties</h3>
        </div>
        <div className="pl-10 space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            In Apps Script, click the <strong>Project Settings</strong> (gear icon) on the left sidebar, scroll down to <strong>Script properties</strong>, and click <strong>Add script property</strong>:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-purple-50 text-purple-900 font-bold">
                <tr>
                  <th className="p-2.5 border-b border-gray-200">Property Name</th>
                  <th className="p-2.5 border-b border-gray-200">Example / Recommended Value</th>
                  <th className="p-2.5 border-b border-gray-200">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-purple-800">CNN_API_URL</td>
                  <td className="p-2.5 text-gray-800">https://lepvision-api.onrender.com</td>
                  <td className="p-2.5 font-sans text-gray-600">Your model server address (no trailing slash).</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-800">CNN_API_TOKEN</td>
                  <td className="p-2.5 text-gray-800">cnn_9e81b2c73041a9d8...</td>
                  <td className="p-2.5 font-sans text-gray-600">The secret bearer token matching API_TOKEN on the model server.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-800">ROOT_FOLDER_ID</td>
                  <td className="p-2.5 text-gray-500">(Leave blank or custom ID)</td>
                  <td className="p-2.5 font-sans text-gray-600">Our code will automatically find or create "Butterfly Dataset" in your Drive root if blank!</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-800">GEMINI_API_KEY</td>
                  <td className="p-2.5 text-gray-800">AIzaSy... (optional)</td>
                  <td className="p-2.5 font-sans text-gray-600">Provides backup vision classification if CNN is offline!</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-800">BOOTSTRAP_ACCOUNTS</td>
                  <td className="p-2.5 text-gray-700">[{`"username":"admin","role":"admin","password":"password123"`}]</td>
                  <td className="p-2.5 font-sans text-gray-600">Initial accounts to seed on first run.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
            3
          </span>
          <h3 className="font-bold text-gray-900 text-base">Run First Test & Grant Drive Authorizations</h3>
        </div>
        <div className="pl-10 space-y-2 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            1. In the Apps Script code editor, select the function <code className="bg-purple-100 text-purple-900 font-mono px-1 rounded">testClassifier</code> or <code className="bg-purple-100 text-purple-900 font-mono px-1 rounded">setupDriveDirectory</code> from the dropdown at the top.
          </p>
          <p>
            2. Click <strong>Run</strong>. Google will show an <strong>Authorization Required</strong> popup.
          </p>
          <p>
            3. Click <em>Review permissions</em> &gt; choose your Google account &gt; click <em>Advanced</em> &gt; click <em>Go to Butterfly Shop (unsafe)</em> &gt; click <strong>Allow</strong>.
          </p>
          <p className="text-emerald-700 font-medium">
            ✅ Check the Execution log: You will see your newly created "Butterfly Dataset" Google Drive link!
          </p>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
            4
          </span>
          <h3 className="font-bold text-gray-900 text-base">Deploy as Web App</h3>
        </div>
        <div className="pl-10 space-y-2 text-xs md:text-sm text-gray-700 leading-relaxed">
          <p>
            1. In the top right of Apps Script, click <strong>Deploy &gt; New deployment</strong>.
          </p>
          <p>
            2. Select type: <strong>Web app</strong> (gear icon next to 'Select type').
          </p>
          <p>
            3. Configure settings:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Execute as:</strong> <code>Me (your email)</code></li>
            <li><strong>Who has access:</strong> <code className="text-purple-700 font-bold">Anyone</code> (CRITICAL: If not set to Anyone, external fetch or web app requests will fail with login redirects!)</li>
          </ul>
          <p>
            4. Click <strong>Deploy</strong> and copy your published Web App URL!
          </p>
        </div>
      </div>
    </div>
  );
};
