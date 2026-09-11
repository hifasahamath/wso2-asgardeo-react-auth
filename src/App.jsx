import React, { useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import Navbar from './components/Navbar.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import LoginCard from './components/LoginCard.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Shield } from 'lucide-react';

export default function App() {
  const {
    state,
    signIn,
    signOut,
    getDecodedIDToken,
    getBasicUserInfo,
    refreshAccessToken
  } = useAuthContext();

  // Offline simulation state for developer preview when credentials are unlinked
  const [simulatedAuth, setSimulatedAuth] = useState(false);

  const simulatedClaims = {
    sub: "b2c9d814-7a32-416e-a34f-9efd2381204a",
    iss: "https://api.asgardeo.io/t/hifasahamath/oauth2/token",
    aud: "d9GTsFC47ZZIH7RnqdKscsg8u94a",
    email: "hifas.ahamath@wso2.com",
    name: "Hifas Ahamath",
    given_name: "Hifas",
    family_name: "Ahamath",
    username: "hifas.ahamath",
    iat: Math.floor(Date.now() / 1000) - 300,
    exp: Math.floor(Date.now() / 1000) + 3300,
    auth_time: Math.floor(Date.now() / 1000) - 300,
    org_name: "hifasahamath",
    acr: "2"
  };

  const isUserAuthenticated = state?.isAuthenticated || simulatedAuth;

  const handleSignOut = () => {
    if (simulatedAuth) {
      setSimulatedAuth(false);
    } else {
      signOut();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-200">
      {/* Top Navigation Bar */}
      <Navbar isAuthenticated={isUserAuthenticated} user={state} />

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col justify-center">
        {state?.isLoading ? (
          <LoadingSpinner message="Authenticating with WSO2 Asgardeo..." />
        ) : isUserAuthenticated ? (
          <Dashboard
            state={simulatedAuth ? { ...state, isAuthenticated: true, decodedIDToken: simulatedClaims, displayName: "Hifas Ahamath", email: "hifas.ahamath@wso2.com", username: "hifas.ahamath" } : state}
            onSignOut={handleSignOut}
            getDecodedIDToken={simulatedAuth ? async () => simulatedClaims : getDecodedIDToken}
            getBasicUserInfo={simulatedAuth ? async () => ({ displayName: "Hifas Ahamath", email: "hifas.ahamath@wso2.com", username: "hifas.ahamath" }) : getBasicUserInfo}
            refreshAccessToken={refreshAccessToken}
          />
        ) : (
          <LoginCard 
            onSignIn={signIn} 
            onSimulateAuth={() => setSimulatedAuth(true)}
            onPreviewDemo={() => setSimulatedAuth(true)}
          />
        )}
      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0a0e17]/80 py-5 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-wso2-500" />
            <span>WSO2 Asgardeo &bull; OpenID Connect 1.0</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            PKCE Authorization Flow &bull; React 18 &bull; Tailwind CSS
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <a 
              href="https://github.com/hifasahamath/wso2-asgardeo-react-auth.git" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>
            <span>&bull;</span>
            <a 
              href="https://wso2.com/asgardeo" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              Asgardeo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
