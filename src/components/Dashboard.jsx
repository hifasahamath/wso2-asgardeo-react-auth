import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  AtSign, 
  LogOut, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Clock,
  CheckCircle,
  Building
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
        if (typeof getDecodedIDToken === 'function') {
          const claims = await getDecodedIDToken();
          if (isMounted) setDecodedClaims(claims);
        } else if (state?.decodedIDToken) {
          if (isMounted) setDecodedClaims(state.decodedIDToken);
        }

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
        setRefreshMessage('Tokens silently renewed successfully via Asgardeo.');
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

  const isUsernameEmail = rawUsername && rawUsername.includes('@');

  const email = 
    decodedClaims?.email || 
    basicUserInfo?.email || 
    state?.email || 
    (isUsernameEmail ? rawUsername : null) || 
    'No email claim mapped';

  const displayName = 
    basicUserInfo?.displayName || 
    state?.displayName || 
    decodedClaims?.given_name || 
    decodedClaims?.name || 
    (isUsernameEmail ? rawUsername.split('@')[0] : rawUsername) || 
    'Authenticated User';

  const hasEmailClaim = Boolean(decodedClaims?.email);

  const username = 
    basicUserInfo?.username || 
    state?.username || 
    decodedClaims?.sub || 
    'asgardeo-user';

  const initial = displayName.charAt(0).toUpperCase();

  // Authentication timestamp
  const authTime = decodedClaims?.auth_time 
    ? new Date(decodedClaims.auth_time * 1000).toLocaleString() 
    : decodedClaims?.iat 
      ? new Date(decodedClaims.iat * 1000).toLocaleString() 
      : new Date().toLocaleString();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Action & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Active OIDC Session</span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">PKCE Verified</span>
            </div>
            <p className="text-xs text-slate-400">
              Authenticated with WSO2 Asgardeo Identity Cloud
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-wso2-400' : 'text-slate-400'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Token'}</span>
          </button>

          <button
            onClick={() => setShowSignOutConfirm(true)}
            id="signout-button"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/10 text-slate-200 hover:text-rose-400 text-xs font-medium border border-slate-700/60 hover:border-rose-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {refreshMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{refreshMessage}</span>
        </div>
      )}

      {/* User Profile Summary */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            {/* Avatar Initial */}
            <div className="w-14 h-14 rounded-xl bg-wso2-500 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
              {initial}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Auth Time: {authTime}</span>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-1">Username / Subject</span>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 truncate">
              <AtSign className="w-3.5 h-3.5 text-wso2-400 shrink-0" />
              <span className="truncate">{username}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-1">Email Address</span>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-wso2-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-1">Authorization Protocol</span>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-wso2-400 shrink-0" />
              <span>OIDC 1.0 (PKCE)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block mb-1">Identity Authority</span>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 truncate">
              <Building className="w-3.5 h-3.5 text-wso2-400 shrink-0" />
              <span className="truncate">WSO2 Asgardeo Cloud</span>
            </div>
          </div>
        </div>

        {/* Optional IAM console notice when claims are sparse */}
        {!hasEmailClaim && (
          <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              To map user attributes into the ID token, enable claims in <strong>Asgardeo Console &rarr; Applications &rarr; User Attributes</strong>.
            </span>
            <a 
              href="https://console.asgardeo.io" 
              target="_blank" 
              rel="noreferrer"
              className="text-wso2-400 hover:text-wso2-300 font-medium shrink-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Confirm Sign Out</h3>
                <p className="text-xs text-slate-400">End your active Asgardeo session</p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              Your local session tokens will be cleared and you will be redirected to the Asgardeo logout endpoint.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onSignOut();
                }}
                className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
