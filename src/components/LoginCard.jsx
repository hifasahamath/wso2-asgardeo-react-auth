import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Layers, 
  Lock, 
  ArrowRight, 
  Info, 
  CheckCircle, 
  Sparkles,
  Cpu,
  Fingerprint,
  UserPlus
} from 'lucide-react';

export default function LoginCard({ onSignIn, onPreviewDemo }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsRedirecting(true);
      await onSignIn();
    } catch (err) {
      console.error("Sign-in trigger error:", err);
      setIsRedirecting(false);
    }
  };

  // Derive Asgardeo organization direct registration URL
  const baseUrl = import.meta.env.VITE_ASGARDEO_BASE_URL || '';
  const orgMatch = baseUrl.match(/\/t\/([^/]+)/);
  const orgName = orgMatch ? orgMatch[1] : 'hifasahamath';
  const registerUrl = `https://accounts.asgardeo.io/t/${orgName}/accounts/register`;

  const handleRegister = () => {
    setIsRedirecting(true);
    window.location.href = registerUrl;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wso2-500/10 border border-wso2-500/20 text-wso2-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WSO2 Internship Contribution Showcase</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          WSO2 Asgardeo <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-wso2-400 via-wso2-500 to-amber-400 bg-clip-text text-transparent">
            OIDC Integration Demo
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A production-ready Single Page Application demonstrating enterprise-grade Identity & Access Management (IAM) with WSO2 Asgardeo, React 18, and PKCE-secured authorization flows.
        </p>

        {/* Primary CTA & Interactive Preview controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <button
            onClick={handleSignIn}
            disabled={isRedirecting}
            id="signin-button"
            className="w-full sm:w-auto min-w-[200px] px-7 py-4 rounded-xl bg-gradient-to-r from-wso2-500 to-wso2-600 hover:from-wso2-600 hover:to-wso2-700 text-white font-semibold text-base shadow-xl shadow-wso2-500/25 hover:shadow-wso2-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer group"
          >
            {isRedirecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Redirecting to Asgardeo...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5 text-wso2-100" />
                <span>Sign In with Asgardeo</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <button
            onClick={handleRegister}
            disabled={isRedirecting}
            id="create-account-btn"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 hover:border-wso2-500/50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg group cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-wso2-400 group-hover:scale-110 transition-transform" />
            <span>Create Account / Sign Up</span>
          </button>

          {onPreviewDemo && (
            <button
              onClick={onPreviewDemo}
              id="preview-demo-btn"
              className="w-full sm:w-auto px-5 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-medium text-xs border border-slate-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Preview Demo State</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Card 1: OAuth 2.0 & OIDC */}
        <div className="relative group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-wso2-500/40 rounded-2xl p-5 transition-all duration-300 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-wso2-500/10 border border-wso2-500/20 flex items-center justify-center text-wso2-400 mb-3 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              OAuth 2.0 & OIDC
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Standardized OpenID Connect protocols delivering verified user authentication, ID tokens, and secure claim assertions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-wso2-400 font-medium">
            <CheckCircle className="w-3 h-3 mr-1.5 text-emerald-400" />
            Standards-Compliant Identity
          </div>
        </div>

        {/* Card 2: PKCE Flow */}
        <div className="relative group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-5 transition-all duration-300 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              PKCE Authorization
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Proof Key for Code Exchange (RFC 7636) prevents authorization code interception attacks on public browser single-page apps.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-sky-400 font-medium">
            <CheckCircle className="w-3 h-3 mr-1.5 text-emerald-400" />
            Zero Client Secrets Stored
          </div>
        </div>

        {/* Card 3: Self-Service Registration */}
        <div className="relative group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              Self-Registration
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Automated user self-onboarding directly inside Asgardeo with password policy enforcement and cloud directory storage.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-emerald-400 font-medium">
            <CheckCircle className="w-3 h-3 mr-1.5 text-emerald-400" />
            Instant User Provisioning
          </div>
        </div>

        {/* Card 4: Secure Session Management */}
        <div className="relative group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-300 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              Session & Claims
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Protected token lifecycle with transparent silent renewal, verified ID token parsing, and secure single sign-out.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-amber-400 font-medium">
            <CheckCircle className="w-3 h-3 mr-1.5 text-emerald-400" />
            In-Memory Token Security
          </div>
        </div>
      </div>

      {/* Developer Advisory Info Banner */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <span>Asgardeo Console Configuration Checklist</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">IAM Protocol</span>
          </h4>
          <p className="text-slate-300 leading-relaxed">
            Ensure your <strong>Authorized Redirect URLs</strong> and <strong>Allowed Origins</strong> in the Asgardeo Console match your current domain (<code className="text-sky-300 font-mono bg-slate-950 px-1 py-0.5 rounded">{window.location.origin}</code> or your Vercel production URL).
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-wso2-400"></span>
              Scopes: <strong className="text-slate-200">openid, profile, email</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Response Type: <strong className="text-slate-200">code (PKCE)</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
