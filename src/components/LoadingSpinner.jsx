import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function LoadingSpinner({ message = "Authenticating with WSO2 Asgardeo..." }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        {/* Outer pulsing ring */}
        <div className="w-20 h-20 rounded-full border-4 border-wso2-500/20 border-t-wso2-500 animate-spin" />
        {/* Inner secondary spinning ring */}
        <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-sky-500/20 border-b-sky-400 animate-spin [animation-duration:1.5s]" />
        {/* Center brand icon */}
        <div className="absolute inset-0 flex items-center justify-center text-wso2-500">
          <ShieldCheck className="w-7 h-7 animate-pulse text-wso2-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
        {message}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm">
        Validating PKCE authorization code and exchanging tokens with Asgardeo Identity Server...
      </p>

      {/* Modern animated progress bar */}
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-6">
        <div className="w-full h-full bg-gradient-to-r from-wso2-500 via-sky-400 to-wso2-500 animate-pulse" />
      </div>
    </div>
  );
}
