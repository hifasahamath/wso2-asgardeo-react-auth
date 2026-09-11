import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  FileText, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  Key,
  Calendar,
  Layers
} from 'lucide-react';

export default function TokenViewer({ claims = {} }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('parsed'); // Default to parsed claims for immediate readability

  const formattedJson = JSON.stringify(claims, null, 2);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy claims:', err);
    }
  };

  const handleCopyValue = async (key, val) => {
    try {
      await navigator.clipboard.writeText(String(val));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch (err) {
      console.error('Failed to copy value:', err);
    }
  };

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
      label: 'Subject Identifier',
      value: claims?.sub || 'N/A',
      icon: UserCheck,
      description: 'Persistent unique identifier for the authenticated user.'
    },
    {
      key: 'iss',
      label: 'Token Issuer',
      value: claims?.iss || 'N/A',
      icon: Key,
      description: 'WSO2 Asgardeo authority that minted and signed this token.'
    },
    {
      key: 'aud',
      label: 'Audience (Client ID)',
      value: Array.isArray(claims?.aud) ? claims.aud.join(', ') : claims?.aud || 'N/A',
      icon: ShieldCheck,
      description: 'The registered application Client ID matching your Asgardeo SPA.'
    },
    {
      key: 'iat',
      label: 'Issued At',
      value: claims?.iat ? `${claims.iat} (${formatTimestamp(claims.iat)})` : 'N/A',
      icon: Calendar,
      description: 'Unix timestamp when this token was issued.'
    },
    {
      key: 'exp',
      label: 'Expires At',
      value: claims?.exp ? `${claims.exp} (${formatTimestamp(claims.exp)})` : 'N/A',
      icon: Clock,
      description: 'Unix timestamp marking the exact validity limit.'
    },
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-wso2-500/10 border border-wso2-500/20 text-wso2-400 flex items-center justify-center">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Decoded Token Claims</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                JWT Payload
              </span>
            </h3>
          </div>
        </div>

        {/* View switcher & Copy action */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('parsed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'parsed'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Claims Breakdown
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'raw'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw JSON
            </button>
          </div>

          <button
            onClick={handleCopyAll}
            id="copy-claims-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
            title="Copy full JSON payload"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6">
        {activeTab === 'raw' ? (
          <div className="w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-xs font-mono">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-slate-900/30 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-wso2-400" />
                id_token.payload.json
              </span>
              <span className="text-[10px] text-slate-500 uppercase">Read-Only</span>
            </div>
            <pre className="p-4 text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed selection:bg-emerald-500/20">
              <code>{formattedJson}</code>
            </pre>
          </div>
        ) : (
          <div className="space-y-2.5">
            {keyClaims.map((item) => {
              const Icon = item.icon;
              const isCopied = copiedKey === item.key;
              return (
                <div
                  key={item.key}
                  className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-800 text-wso2-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-wso2-400 bg-wso2-500/10 px-1.5 py-0.5 rounded border border-wso2-500/20">
                          {item.key}
                        </span>
                        <span className="text-xs font-medium text-slate-200">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto max-w-full">
                    <div className="flex-1 md:flex-none font-mono text-xs text-slate-300 break-all max-w-full md:max-w-md bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800/80">
                      {String(item.value)}
                    </div>
                    {item.value !== 'N/A' && (
                      <button
                        onClick={() => handleCopyValue(item.key, item.value)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors shrink-0 cursor-pointer"
                        title="Copy claim value"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
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
