import React from 'react';
import { Shield, Github, ExternalLink, CheckCircle2, Lock } from 'lucide-react';

export default function Navbar({ isAuthenticated = false, user = null }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-wso2-600 to-wso2-400 text-white shadow-lg shadow-wso2-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                WSO2 Asgardeo
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-wso2-500/10 text-wso2-400 border border-wso2-500/20">
                OIDC SPA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              React 18 &bull; PKCE Auth Flow &bull; Decoded JWT Inspector
            </p>
          </div>
        </div>

        {/* Status indicator & Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Auth Status */}
          <div className={`hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
            isAuthenticated
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
          }`}>
            {isAuthenticated ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Connected to Asgardeo</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Unauthenticated</span>
              </>
            )}
          </div>

          {/* GitHub Repo link */}
          <a
            href="https://github.com/hifasahamath/wso2-asgardeo-react-auth.git"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden md:inline">Repository</span>
          </a>

          {/* Asgardeo Docs link */}
          <a
            href="https://wso2.com/asgardeo/docs"
            target="_blank"
            rel="noreferrer"
            aria-label="Asgardeo Documentation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-wso2-400 hover:text-wso2-300 bg-wso2-500/10 hover:bg-wso2-500/20 border border-wso2-500/20 transition-colors"
          >
            <span className="hidden md:inline">Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
