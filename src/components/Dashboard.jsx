import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  AtSign, 
  Calendar, 
  LogOut, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import TokenViewer from './TokenViewer.jsx';

export default function Dashboard({ 
  state, 
  onSignOut, 
  getDecodedIDToken, 
  getBasicUserInfo,
  refreshAccessToken 
}) {
  const [decodedClaims, setDecodedClaims] = useState(null);
  const [basicUserInfo, setBasicUserInfo] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  // Fetch token claims and basic user info when dashboard mounts
  useEffect(() => {
    let isMounted = true;

    async function loadIdentityData() {
      try {
        setLoadingToken(true);
        // Fetch decoded ID token
        if (typeof getDecodedIDToken === 'function') {
          const claims = await getDecodedIDToken();
          if (isMounted) setDecodedClaims(claims);
        } else if (state?.decodedIDToken) {
          if (isMounted) setDecodedClaims(state.decodedIDToken);
        }

        // Fetch user profile info
        if (typeof getBasicUserInfo === 'function') {
          const info = await getBasicUserInfo();
          if (isMounted) setBasicUserInfo(info);
        }
      } catch (error) {
        console.error('Error retrieving identity data:', error);
      } finally {
        if (isMounted) setLoadingToken(false);
      }
    }

    loadIdentityData();
    return () => {
      isMounted = false;
    };
  }, [getDecodedIDToken, getBasicUserInfo, state]);

  // Handle token refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setRefreshMessage('');
      if (typeof refreshAccessToken === 'function') {
        await refreshAccessToken();
        if (typeof getDecodedIDToken === 'function') {
          const freshClaims = await getDecodedIDToken();
          setDecodedClaims(freshClaims);
        }
        setRefreshMessage('Tokens silently renewed successfully via Asgardeo!');
        setTimeout(() => setRefreshMessage(''), 4000);
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setRefreshMessage('Silent renewal failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Derive user display attributes with clean fallbacks
  const rawUsername = 
    decodedClaims?.username || 
    basicUserInfo?.username || 
    state?.username || 
    decodedClaims?.sub || 
    'asgardeo-user';

  // Check if username is formatted as email
  const isUsernameEmail = rawUsername && rawUsername.includes('@');

  const email = 
    decodedClaims?.email || 
    basicUserInfo?.email || 
    state?.email || 
    (isUsernameEmail ? rawUsername : null) || 
    'No primary email mapped';

  const displayName = 
    basicUserInfo?.displayName || 
    state?.displayName || 
    decodedClaims?.given_name || 
    decodedClaims?.name || 
    (isUsernameEmail ? rawUsername.split('@')[0] : rawUsername) || 
    'Asgardeo User';

  const hasEmailClaim = Boolean(decodedClaims?.email);

  const username = 
    basicUserInfo?.username || 
    state?.username || 
    decodedClaims?.sub || 
    'asgardeo-authenticated-user';

  const initial = displayName.charAt(0).toUpperCase();

  // Authentication timestamp
  const authTime = decodedClaims?.auth_time 
    ? new Date(decodedClaims.auth_time * 1000).toLocaleString() 
    : decodedClaims?.iat 
      ? new Date(decodedClaims.iat * 1000).toLocaleString() 
      : new Date().toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Session Active Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Active OIDC Session
            </span>
            <p className="text-xs text-slate-300">
              Authenticated through WSO2 Asgardeo Identity Cloud with PKCE validation.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
            title="Perform silent token renewal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-wso2-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'Renewing...' : 'Refresh Token'}</span>
          </button>

          <button
            onClick={() => setShowSignOutConfirm(true)}
            id="signout-button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {refreshMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{refreshMessage}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle accent glow in background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-wso2-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar Initial with gradient border */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-wso2-600 via-wso2-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg shadow-wso2-500/30">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full">
                <span className="block w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {displayName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-wso2-500/15 text-wso2-400 border border-wso2-500/30">
                  Verified Identity
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Auth Time: {authTime}</span>
            </div>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium block mb-1">Username</span>
            <div className="text-sm font-semibold text-white flex items-center gap-2 truncate">
              <AtSign className="w-4 h-4 text-wso2-400 shrink-0" />
              <span className="truncate">{username}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium block mb-1">Primary Email</span>
            <div className="text-sm font-semibold text-white flex items-center gap-2 truncate">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium block mb-1">OIDC Flow</span>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authorization Code + PKCE</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium block mb-1">IdP Organization</span>
            <div className="text-sm font-semibold text-white flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-wso2-500 shrink-0"></span>
              <span className="truncate">WSO2 Asgardeo Cloud</span>
            </div>
          </div>
        </div>

        {/* Optional IAM Tip when attributes are not yet mapped in Asgardeo */}
        {!hasEmailClaim && (
          <div className="mt-4 p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                <strong>IAM Tip:</strong> To include verified <code>email</code>, <code>given_name</code>, and <code>family_name</code> claims in the ID token, enable them in <strong>Asgardeo Console &rarr; Applications &rarr; User Attributes</strong>.
              </span>
            </div>
            <a 
              href="https://console.asgardeo.io" 
              target="_blank" 
              rel="noreferrer"
              className="text-sky-400 hover:text-white underline font-medium shrink-0"
            >
              Open Console &rarr;
            </a>
          </div>
        )}
      </div>

      {/* Token & Claims Inspector Section */}
      <TokenViewer claims={decodedClaims || {}} />

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Sign Out</h3>
                <p className="text-xs text-slate-400">End your current Asgardeo session</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Are you sure you want to sign out? Your local tokens will be purged and you will be redirected to the Asgardeo OIDC logout endpoint.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onSignOut();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-lg shadow-rose-600/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
