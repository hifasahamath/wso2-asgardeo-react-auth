import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Hash, 
  UserCheck, 
  Key,
  Calendar
} from 'lucide-react';

export default function TokenViewer({ claims = {} }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('raw'); // 'raw' or 'parsed'

  const formattedJson = JSON.stringify(claims, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy claims:', err);
    }
  };

  // Convert Unix timestamp to readable ISO/Locale string
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch {
      return String(timestamp);
    }
  };

  const keyClaims = [
    {
      key: 'sub',
      label: 'Subject (User Identifier)',
      value: claims?.sub || 'N/A',
      icon: UserCheck,
      description: 'Unique persistent identifier for the authenticated end-user across Asgardeo.'
    },
    {
      key: 'iss',
      label: 'Issuer (IdP URL)',
      value: claims?.iss || 'N/A',
      icon: Key,
      description: 'The WSO2 Asgardeo organization identity authority that signed this ID token.'
    },
    {
      key: 'aud',
      label: 'Audience (Client ID)',
      value: Array.isArray(claims?.aud) ? claims.aud.join(', ') : claims?.aud || 'N/A',
      icon: ShieldCheck,
      description: 'The intended client application (your Asgardeo SPA Client ID).'
    },
    {
      key: 'iat',
      label: 'Issued At',
      value: claims?.iat ? `${claims.iat} (${formatTimestamp(claims.iat)})` : 'N/A',
      icon: Calendar,
      description: 'Unix timestamp when this OIDC token was generated.'
    },
    {
      key: 'exp',
      label: 'Expires At',
      value: claims?.exp ? `${claims.exp} (${formatTimestamp(claims.exp)})` : 'N/A',
      icon: Clock,
      description: 'Unix timestamp marking the exact validity expiry limit.'
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-wso2-500/10 border border-wso2-500/20 text-wso2-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Decoded OIDC Token Claims</span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                JWT Payload
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified claims extracted directly from the signed Asgardeo ID Token
            </p>
          </div>
        </div>

        {/* View switcher & Copy action */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'raw'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JSON Inspector
            </button>
            <button
              onClick={() => setActiveTab('parsed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'parsed'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Claims Breakdown
            </button>
          </div>

          <button
            onClick={handleCopy}
            id="copy-claims-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Claims JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'raw' ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/40 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-wso2-400" />
                id_token.payload.json
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Read-Only</span>
            </div>
            <pre className="p-4 text-emerald-400 overflow-x-auto max-h-[420px] leading-relaxed selection:bg-emerald-500/20">
              <code>{formattedJson}</code>
            </pre>
          </div>
        ) : (
          <div className="space-y-3">
            {keyClaims.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-wso2-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                          {item.key}
                        </span>
                        <span className="text-xs font-medium text-white">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left md:text-right font-mono text-xs text-slate-300 break-all max-w-md bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                    {String(item.value)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
