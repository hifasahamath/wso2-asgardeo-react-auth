import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@asgardeo/auth-react';
import App from './App.jsx';
import './index.css';
import { AlertTriangle, Key, Terminal, ExternalLink, RefreshCw } from 'lucide-react';

// Read configuration from Vite environment variables
const clientId = import.meta.env.VITE_ASGARDEO_CLIENT_ID;
const baseUrl = import.meta.env.VITE_ASGARDEO_BASE_URL;
const redirectUrl = import.meta.env.VITE_ASGARDEO_REDIRECT_URL || window.location.origin;
const postLogoutUrl = import.meta.env.VITE_ASGARDEO_POST_LOGOUT_URL || window.location.origin;

// Helper to determine if configuration is missing or remains untouched placeholder
const isPlaceholder = (val) => !val || val.includes('<YOUR_') || val === 'undefined';
const isMissingConfig = isPlaceholder(clientId) || isPlaceholder(baseUrl);

const authConfig = {
  signInRedirectURL: redirectUrl,
  signOutRedirectURL: postLogoutUrl,
  clientID: clientId || '',
  baseUrl: baseUrl || '',
  scope: ['openid', 'profile', 'email']
};

/**
 * Graceful fallback component rendered if Asgardeo environment variables
 * have not yet been configured in .env.local
 */
function MissingConfigFallback() {
  const envSnippet = `# .env.local
VITE_ASGARDEO_CLIENT_ID=your_client_id_from_asgardeo
VITE_ASGARDEO_BASE_URL=https://api.asgardeo.io/t/your_org_name
VITE_ASGARDEO_REDIRECT_URL=${window.location.origin}
VITE_ASGARDEO_POST_LOGOUT_URL=${window.location.origin}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        <div className="flex items-center gap-3 text-amber-400 mb-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              WSO2 Asgardeo Configuration Required
            </h1>
            <p className="text-sm text-amber-300/90 font-medium">
              Missing or placeholder credentials detected in environment variables
            </p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          To enable OpenID Connect (OIDC) authentication with WSO2 Asgardeo, please define your application credentials in your <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code> file.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Required in .env.local
              </span>
              <span className="text-amber-400 font-medium">Action Required</span>
            </div>
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-900/60 rounded-lg selection:bg-emerald-500/30">
              {envSnippet}
            </pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold">1. Asgardeo Console</span>
              <p className="text-slate-300">
                Register a <strong>Single-Page Application</strong> in Asgardeo and copy the Client ID.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold">2. Authorized Redirect</span>
              <p className="text-slate-300">
                Set Authorized Redirect URL to <code className="text-wso2-400">{window.location.origin}</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
          <a
            href="https://console.asgardeo.io"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-wso2-500 hover:bg-wso2-600 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Open Asgardeo Console</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
          <button
            onClick={() => {
              sessionStorage.setItem('wso2_preview_session', 'true');
              sessionStorage.setItem('wso2_demo_preview', 'true');
              window.location.reload();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors border border-slate-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-wso2-400" />
            <span>Simulate Developer Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const isPreviewActive = 
  sessionStorage.getItem('wso2_preview_session') === 'true' || 
  sessionStorage.getItem('wso2_demo_preview') === 'true';

if (isMissingConfig && !isPreviewActive) {
  root.render(
    <React.StrictMode>
      <MissingConfigFallback />
    </React.StrictMode>
  );
} else {
  // If simulation active without live credentials, provide fallback mock config to satisfy AuthProvider
  const safeConfig = isMissingConfig ? {
    signInRedirectURL: redirectUrl,
    signOutRedirectURL: postLogoutUrl,
    clientID: 'preview-client-id',
    baseUrl: 'https://api.asgardeo.io/t/preview-organization',
    scope: ['openid', 'profile', 'email']
  } : authConfig;

  root.render(
    <React.StrictMode>
      <AuthProvider config={safeConfig}>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}
