import React from 'react';

export default function LoadingSpinner({ message = "Authenticating with WSO2 Asgardeo..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-9 h-9 rounded-full border-2 border-slate-800 border-t-wso2-500 animate-spin mb-4" />
      <h3 className="text-sm font-semibold text-white tracking-tight mb-1">
        {message}
      </h3>
      <p className="text-xs text-slate-400 max-w-xs">
        Exchanging authorization code and validating OIDC tokens...
      </p>
    </div>
  );
}
