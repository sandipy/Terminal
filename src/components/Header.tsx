import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Wifi, 
  WifiOff, 
  Clock, 
  ShieldAlert,
  Flame,
  Download,
  Maximize2
} from 'lucide-react';
import { soundEngine } from '../utils/audioAlert';
import { requestNotificationPermission, sendBrowserPushNotification, getNotificationPermission } from '../utils/notifications';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  isOnline: boolean;
  lastSyncTime: string;
  nextHighImpactTime: string;
  nextHighImpactTitle: string;
  onFireTestAlert: () => void;
  viewMode?: 'cockpit' | 'flow';
  onToggleViewMode?: () => void;
  isSignalsOnly?: boolean;
  onToggleSignalsOnly?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  isAudioOn,
  onToggleAudio,
  isOnline,
  lastSyncTime,
  nextHighImpactTime,
  nextHighImpactTitle,
  onFireTestAlert,
  viewMode = 'cockpit',
  onToggleViewMode,
  isSignalsOnly = false,
  onToggleSignalsOnly,
}) => {
  const [notificationPerm, setNotificationPerm] = useState<string>('default');
  const [sessionTimes, setSessionTimes] = useState<{ [key: string]: boolean }>({
    London: true,
    NewYork: true,
    Tokyo: false,
    Sydney: false,
  });
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);

  useEffect(() => {
    setNotificationPerm(getNotificationPermission());

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Update market sessions based on UTC hours
    const updateSessions = () => {
      const utcHour = new Date().getUTCHours();
      setSessionTimes({
        London: utcHour >= 8 && utcHour < 16,
        NewYork: utcHour >= 13 && utcHour < 21,
        Tokyo: utcHour >= 0 && utcHour < 9,
        Sydney: utcHour >= 21 || utcHour < 6,
      });
    };
    updateSessions();
    const interval = setInterval(updateSessions, 60000);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearInterval(interval);
    };
  }, []);

  const handleToggleNotification = async () => {
    const status = await requestNotificationPermission();
    setNotificationPerm(status);
    if (status === 'granted') {
      sendBrowserPushNotification('MacroPulse Alerts Active', {
        body: 'You will receive push alerts for high-impact economic news releases & target price triggers.',
      });
      if (isAudioOn) soundEngine.playPriceAlertChime();
    }
  };

  const handleInstallPwa = async () => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      const res = await pwaPrompt.userChoice;
      if (res.outcome === 'accepted') {
        setPwaPrompt(null);
      }
    }
  };

  return (
    <header 
      id="app-header" 
      className={`border-b transition-colors duration-200 sticky top-0 z-40 backdrop-blur-md ${
        isDark 
          ? 'bg-[#0b101b]/95 border-slate-800 text-slate-100' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Top Tier: Brand, Live Market Sessions, Controls */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-[2px] bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white font-black text-base sm:text-xl tracking-tighter shrink-0">
              MP
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight truncate">MacroPulse</h1>
                <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-[2px] border shrink-0 hidden sm:inline-block ${
                  isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' : 'border-cyan-600/20 bg-cyan-50 text-cyan-700'
                }`}>
                  MACRO & AI
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs truncate hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cause & Reaction Economics • Live Institutional Flows
              </p>
            </div>
          </div>

          {/* Market Sessions - Visible on large screens */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono">
            <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              SESSIONS:
            </span>
            {Object.entries(sessionTimes).map(([session, isOpen]) => (
              <span 
                key={session} 
                className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] border text-[11px] ${
                  isOpen 
                    ? isDark 
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold' 
                      : 'border-emerald-500/40 bg-emerald-50 text-emerald-700 font-semibold'
                    : isDark 
                      ? 'border-slate-800 bg-slate-900/60 text-slate-500' 
                      : 'border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-[1px] ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                {session}
              </span>
            ))}
          </div>

          {/* Quick Actions & Toggles: High-Priority 1-Click Signals Button & Clean Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* ONE-CLICK BUTTON: REMOVE ALL DETAILS & SHOW ONLY HOT BUY / HOT SELL / BUY / SELL / NEUTRAL */}
            {onToggleSignalsOnly && (
              <button
                id="btn-toggle-signals-only"
                onClick={onToggleSignalsOnly}
                className={`text-xs px-2.5 sm:px-3.5 py-1.5 rounded-[2px] border font-black flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  isSignalsOnly
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50'
                    : isDark 
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' 
                      : 'border-amber-500/50 bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
                title={isSignalsOnly ? "Click to restore all details" : "One-click to remove all details and show ONLY Hot Buy / Hot Sell / Buy / Sell / Neutral signals"}
              >
                <Flame className={`w-3.5 h-3.5 ${isSignalsOnly ? 'text-slate-950 animate-bounce' : 'text-amber-400'}`} />
                <span className="hidden md:inline">
                  {isSignalsOnly ? '⚡ Signals Only (Active)' : '⚡ 1-Click Signals Only'}
                </span>
                <span className="md:hidden text-[11px]">
                  {isSignalsOnly ? '⚡ Details' : '⚡ Signals'}
                </span>
              </button>
            )}

            {/* Layout View Mode Switcher (Hidden when in Signals Only to stay clean) */}
            {onToggleViewMode && !isSignalsOnly && (
              <button
                id="btn-toggle-view-mode"
                onClick={onToggleViewMode}
                className={`text-xs px-2 sm:px-2.5 py-1.5 rounded-[2px] border font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                  viewMode === 'cockpit'
                    ? isDark ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300' : 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : isDark ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={viewMode === 'cockpit' ? 'Currently in 1-Screen Cockpit. Click for Expanded Flow.' : 'Currently in Expanded Flow. Click for 1-Screen Cockpit.'}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{viewMode === 'cockpit' ? 'Cockpit' : 'Flow'}</span>
              </button>
            )}

            {/* Connectivity Status & Cache Badge (Hidden on mobile) */}
            <div 
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border text-xs font-mono shrink-0 ${
                isOnline 
                  ? isDark 
                    ? 'border-slate-800 bg-slate-900/80 text-slate-300' 
                    : 'border-slate-200 bg-slate-100 text-slate-600'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-400 font-medium'
              }`}
              title={`Last cached: ${lastSyncTime}`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden lg:inline">{isOnline ? 'Live' : 'Cached'}</span>
            </div>

            {/* Audio Chime Toggle */}
            <button
              id="btn-toggle-audio"
              onClick={onToggleAudio}
              className={`p-1.5 sm:p-2 rounded-[2px] border transition cursor-pointer shrink-0 ${
                isAudioOn
                  ? isDark ? 'border-blue-500/40 bg-blue-500/10 text-blue-400' : 'border-blue-500/30 bg-blue-50 text-blue-700'
                  : isDark ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-200 bg-slate-100 text-slate-400'
              }`}
              title={isAudioOn ? 'Sound alerts enabled' : 'Sound alerts muted'}
            >
              {isAudioOn ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Test Trigger / Demo Alert (Desktop only) */}
            <button
              id="btn-test-alert"
              onClick={onFireTestAlert}
              className={`hidden lg:flex text-xs px-2.5 py-1.5 rounded-[2px] border items-center gap-1.5 font-medium transition cursor-pointer shrink-0 ${
                isDark 
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' 
                  : 'border-cyan-600/30 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
              }`}
              title="Trigger a simulated real-time news spike alert with sound and notification"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Test</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="btn-toggle-theme"
              onClick={onToggleTheme}
              className={`p-1.5 sm:p-2 rounded-[2px] border transition cursor-pointer shrink-0 ${
                isDark 
                  ? 'border-slate-800 bg-slate-900 text-amber-300 hover:bg-slate-800' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Download Offline Standalone ZIP */}
            <a
              id="btn-download-offline-zip"
              href="./macro-pulse-terminal-offline.zip"
              download="macro-pulse-terminal-offline.zip"
              className={`text-xs px-2 sm:px-2.5 py-1.5 rounded-[2px] border font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                isDark 
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' 
                  : 'border-emerald-600/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
              title="Download standalone offline package (ZIP) to run on your computer without internet"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Offline ZIP</span>
            </a>

            {/* Install PWA Prompt if available */}
            {pwaPrompt && (
              <button
                id="btn-install-pwa"
                onClick={handleInstallPwa}
                className="hidden xl:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-[2px] bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}
          </div>
        </div>

        {/* Lower Banner: Countdown to next high-impact news event (only shown in expanded flow view to keep cockpit 1-screen clean) */}
        {viewMode === 'flow' && (
          <div className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-bold text-red-500 uppercase tracking-wider text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                Next High Impact Event:
              </span>
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {nextHighImpactTitle}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-[2px] border border-amber-500/30">
                <Clock className="w-3 h-3" />
                In: {nextHighImpactTime}
              </span>
              <span className="hidden md:inline text-slate-400">
                High volatility expected in Gold, Oil & USD pairs
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
