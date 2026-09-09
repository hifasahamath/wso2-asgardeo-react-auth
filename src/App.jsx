import React from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import Navbar from './components/Navbar.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import LoginCard from './components/LoginCard.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const {
    state,
    signIn,
    signOut,
    getDecodedIDToken,
    getBasicUserInfo,
    refreshAccessToken
  } = useAuthContext();

  // Allow immediate UI preview in development for recruiters and testers
  const [demoAuth, setDemoAuth] = React.useState(false);

  const mockClaims = {
    sub: "b2c9d814-7a32-416e-a34f-9efd2381204a",
    iss: "https://api.asgardeo.io/t/internship-showcase/oauth2/token",
    aud: "k7P3mL8xQ2rV4tY1wZ9sN6bC5a",
    email: "hifas.intern@wso2.com",
    name: "Hifas Ahamath",
    given_name: "Hifas",
    family_name: "Ahamath",
    username: "hifas.ahamath",
    iat: Math.floor(Date.now() / 1000) - 300,
    exp: Math.floor(Date.now() / 1000) + 3300,
    auth_time: Math.floor(Date.now() / 1000) - 300,
    org_name: "wso2-internship-demo",
    acr: "2"
  };

  const isUserAuthenticated = state?.isAuthenticated || demoAuth;

  const handleSignOut = () => {
    if (demoAuth) {
      setDemoAuth(false);
    } else {
      signOut();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <Navbar isAuthenticated={isUserAuthenticated} user={state} />

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col justify-center">
        {state?.isLoading ? (
          /* Loading State */
          <LoadingSpinner message="Authenticating with WSO2 Asgardeo..." />
        ) : isUserAuthenticated ? (
          /* Authenticated Dashboard View */
          <Dashboard
            state={demoAuth ? { ...state, isAuthenticated: true, decodedIDToken: mockClaims, displayName: "Hifas Ahamath", email: "hifas.intern@wso2.com", username: "hifas.ahamath" } : state}
            onSignOut={handleSignOut}
            getDecodedIDToken={demoAuth ? async () => mockClaims : getDecodedIDToken}
            getBasicUserInfo={demoAuth ? async () => ({ displayName: "Hifas Ahamath", email: "hifas.intern@wso2.com", username: "hifas.ahamath" }) : getBasicUserInfo}
            refreshAccessToken={refreshAccessToken}
          />
        ) : (
          /* Unauthenticated Landing View */
          <LoginCard 
            onSignIn={signIn} 
            onPreviewDemo={() => setDemoAuth(true)}
          />
        )}
      </main>

      {/* Recruiter-Ready Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-4 h-4 text-wso2-500" />
            <span>WSO2 Internship Contribution Submission</span>
          </div>
          <p className="text-slate-500">
            Powered by <span className="text-wso2-400 font-medium">WSO2 Asgardeo</span> &bull; OpenID Connect 1.0 &bull; React 18 &bull; Vite &bull; Tailwind CSS
          </p>
          <div className="flex items-center gap-4 text-slate-400">
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
              Asgardeo Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
