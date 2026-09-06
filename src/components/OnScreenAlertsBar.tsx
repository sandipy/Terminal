import React, { useState } from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Plus, 
  X, 
  Volume2, 
  VolumeX, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { PriceAlert, WatchlistAsset, OnScreenAlertNotice } from '../types';
import { soundEngine } from '../utils/audioAlert';

interface OnScreenAlertsBarProps {
  alerts: PriceAlert[];
  watchlist: WatchlistAsset[];
  isDark: boolean;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlertActive: (id: string) => void;
  onFireTestAlert: () => void;
  activeNotices: OnScreenAlertNotice[];
  onDismissNotice: (id: string) => void;
}

export const OnScreenAlertsBar: React.FC<OnScreenAlertsBarProps> = ({
  alerts,
  watchlist,
  isDark,
  isAudioOn,
  onToggleAudio,
  onAddAlert,
  onDeleteAlert,
  onToggleAlertActive,
  onFireTestAlert,
  activeNotices,
  onDismissNotice,
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickSymbol, setQuickSymbol] = useState(watchlist[0]?.symbol || 'XAU/USD');
  const [quickCondition, setQuickCondition] = useState<'above' | 'below'>('above');
  const [quickPrice, setQuickPrice] = useState('');

  const activeAlerts = alerts.filter(a => a.active && !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(quickPrice);
    if (isNaN(target) || target <= 0) return;

    const currentAsset = watchlist.find(a => a.symbol === quickSymbol);
    onAddAlert({
      symbol: quickSymbol,
      condition: quickCondition,
      targetPrice: target,
      createdPrice: currentAsset?.price || target,
      active: true,
    });
    setQuickPrice('');
    setShowQuickAdd(false);
    if (isAudioOn) soundEngine.playPriceAlertChime();
  };

  const currentAsset = watchlist.find(a => a.symbol === quickSymbol);

  return (
    <div 
      id="on-screen-alerts-hub"
      className={`rounded-[2px] border transition-all duration-200 overflow-hidden ${
        isDark 
          ? 'bg-[#0f172a]/90 border-slate-800 text-slate-100 shadow-md' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* 1. Real-time Triggered Notices (High-Visibility Banner if any triggered) */}
      {activeNotices.length > 0 && (
        <div className="bg-gradient-to-r from-red-600/90 via-amber-600/90 to-red-600/90 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 animate-pulse rounded-[2px]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-white shrink-0" />
            <span className="font-extrabold text-xs uppercase tracking-wider">
              HIGH IMPACT ON-SCREEN ALERT:
            </span>
            <span className="text-xs font-semibold">
              {activeNotices[0].title} — {activeNotices[0].message}
            </span>
          </div>
          <button
            onClick={() => onDismissNotice(activeNotices[0].id)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-[2px] cursor-pointer transition"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main On-Screen Alerts Control Bar */}
      <div className="p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & Status Indicator */}
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-[2px] flex items-center justify-center shrink-0 ${
              activeAlerts.length > 0 
                ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm font-bold tracking-tight">On-Screen Live Alerts & Monitoring</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-[2px] font-bold uppercase tracking-wider whitespace-nowrap inline-flex items-center ${
                  activeAlerts.length > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {activeAlerts.length} Active Price Radars
                </span>
                {triggeredAlerts.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-[2px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap inline-flex items-center">
                    {triggeredAlerts.length} Triggered
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instant visual alerts for Gold, Oil, and Currency price thresholds & scheduled macro releases.
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              id="btn-quick-add-alert"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className={`text-xs px-3 py-1.5 rounded-[2px] border font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                showQuickAdd 
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : isDark 
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' 
                    : 'border-cyan-600/30 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showQuickAdd ? 'Close Quick Add' : 'Set Price Alert'}</span>
            </button>

            <button
              onClick={onToggleAudio}
              className={`p-1.5 rounded-[2px] border transition cursor-pointer ${
                isAudioOn
                  ? isDark ? 'border-blue-500/40 bg-blue-500/15 text-blue-400' : 'border-blue-300 bg-blue-50 text-blue-700'
                  : isDark ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-200 bg-slate-100 text-slate-400'
              }`}
              title={isAudioOn ? 'Sound alerts enabled' : 'Sound alerts muted'}
            >
              {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onFireTestAlert}
              className={`text-xs px-2.5 py-1.5 rounded-[2px] border font-medium flex items-center gap-1 transition cursor-pointer ${
                isDark 
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20' 
                  : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
              title="Test triggering an on-screen alert"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Test Alert</span>
            </button>
          </div>
        </div>

        {/* 3. Quick-Add Alert Form Dropdown / Accordion */}
        {showQuickAdd && (
          <form 
            onSubmit={handleQuickAddSubmit}
            className={`mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div>
              <label className="block text-[11px] font-semibold mb-1 opacity-80">Target Asset</label>
              <select
                value={quickSymbol}
                onChange={(e) => {
                  setQuickSymbol(e.target.value);
                  const a = watchlist.find(item => item.symbol === e.target.value);
                  if (a) {
                    setQuickPrice((a.price * (quickCondition === 'above' ? 1.005 : 0.995)).toFixed(a.category === 'commodity' ? 2 : 4));
                  }
                }}
                className={`w-full px-2.5 py-1.5 text-xs rounded-[2px] border font-mono ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {watchlist.map(a => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} ({a.displayPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 opacity-80">Trigger Condition</label>
              <div className="grid grid-cols-2 gap-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setQuickCondition('above')}
                  className={`py-1.5 px-2 rounded-[2px] border font-semibold flex items-center justify-center gap-1 cursor-pointer transition ${
                    quickCondition === 'above'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  Above &gt;=
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCondition('below')}
                  className={`py-1.5 px-2 rounded-[2px] border font-semibold flex items-center justify-center gap-1 cursor-pointer transition ${
                    quickCondition === 'below'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <TrendingDown className="w-3 h-3" />
                  Below &lt;=
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1 opacity-80">
                Target Price (Current: {currentAsset?.displayPrice || '—'})
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 2855.00"
                value={quickPrice}
                onChange={(e) => setQuickPrice(e.target.value)}
                required
                className={`w-full px-2.5 py-1.5 text-xs rounded-[2px] border font-mono ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                }`}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 px-3 rounded-[2px] bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Create Alert
              </button>
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className={`py-1.5 px-2 rounded-[2px] border text-xs cursor-pointer ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* 4. Active Alerts Horizontal Track */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeAlerts.length === 0 && triggeredAlerts.length === 0 ? (
            <div className={`text-xs font-mono py-1 px-2.5 rounded-[2px] border ${
              isDark ? 'bg-slate-900/60 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              No active price alerts. Click "Set Price Alert" or the bell icon on any asset to arm instant alarms.
            </div>
          ) : (
            <>
              {/* Active alerts */}
              {activeAlerts.map(alert => {
                const asset = watchlist.find(a => a.symbol === alert.symbol);
                const isNear = asset ? Math.abs(asset.price - alert.targetPrice) / alert.targetPrice < 0.005 : false;

                return (
                  <div
                    key={alert.id}
                    id={`on-screen-alert-${alert.id}`}
                    className={`flex items-center gap-2 px-2.5 py-1 rounded-[2px] border text-xs font-mono transition ${
                      isNear 
                        ? 'border-amber-500/50 bg-amber-500/15 text-amber-300 animate-pulse'
                        : isDark 
                          ? 'border-slate-800 bg-slate-900 text-slate-300' 
                          : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className="font-bold">{alert.symbol}</span>
                    <span className="flex items-center gap-0.5 text-[11px] opacity-80">
                      {alert.condition === 'above' ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-rose-400" />
                      )}
                      {alert.targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    {isNear && (
                      <span className="text-[10px] font-extrabold uppercase text-amber-400">
                        NEAR
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-slate-500 hover:text-red-400 transition cursor-pointer p-0.5"
                      title="Remove alert"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Triggered alerts */}
              {triggeredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border text-xs font-mono bg-red-500/15 border-red-500/40 text-red-300"
                >
                  <CheckCircle2 className="w-3 h-3 text-red-400" />
                  <span className="font-bold">{alert.symbol}</span>
                  <span>TRIGGERED at {alert.targetPrice}</span>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="text-red-400 hover:text-red-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
