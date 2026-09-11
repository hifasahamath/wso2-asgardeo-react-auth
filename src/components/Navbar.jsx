import React from 'react';
import { Shield, Github, ExternalLink, Lock } from 'lucide-react';

export default function Navbar({ isAuthenticated = false, user = null }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0e17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-wso2-600 to-wso2-400 flex items-center justify-center text-white shadow-lg shadow-wso2-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg leading-tight">
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

        {/* Right Section: Status Indicator & Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border ${
              isAuthenticated
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            {isAuthenticated ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="hidden sm:inline">Session Active</span>
                <span className="sm:hidden">Active</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">Unauthenticated</span>
                <span className="sm:hidden">Guest</span>
              </>
            )}
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Docs Link */}
          <a
            href="https://wso2.com/asgardeo/docs"
            target="_blank"
            rel="noreferrer"
            aria-label="Asgardeo Documentation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* GitHub Repository */}
          <a
            href="https://github.com/hifasahamath/wso2-asgardeo-react-auth.git"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
