import React, { useState } from 'react';
import { PriceAlert, WatchlistAsset } from '../types';
import { 
  BellRing, 
  Plus, 
  Trash2, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown, 
  Radio, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { soundEngine } from '../utils/audioAlert';

interface AlertsManagerProps {
  alerts: PriceAlert[];
  watchlist: WatchlistAsset[];
  isDark: boolean;
  onAddAlert: (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlertActive: (id: string) => void;
  onTriggerTestAlert: () => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  alerts,
  watchlist,
  isDark,
  onAddAlert,
  onDeleteAlert,
  onToggleAlertActive,
  onTriggerTestAlert,
}) => {
  const [symbol, setSymbol] = useState<string>(watchlist[0]?.symbol || 'XAU/USD');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState<string>('2860.00');

  const selectedAsset = watchlist.find((a) => a.symbol === symbol);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    onAddAlert({
      symbol,
      condition,
      targetPrice: priceNum,
      createdPrice: selectedAsset?.price || priceNum,
      active: true,
    });
    soundEngine.playPriceAlertChime();
  };

  const handleAssetSelect = (newSymbol: string) => {
    setSymbol(newSymbol);
    const asset = watchlist.find((a) => a.symbol === newSymbol);
    if (asset) {
      // Pre-fill target price nicely
      if (asset.symbol === 'XAU/USD') setTargetPrice('2860.00');
      else if (asset.symbol === 'WTI/USD') setTargetPrice('75.50');
      else if (asset.symbol === 'EUR/USD') setTargetPrice('1.0875');
      else if (asset.symbol === 'USD/JPY') setTargetPrice('152.20');
      else setTargetPrice(asset.price.toString());
    }
  };

  return (
    <div id="price-alerts-manager" className="space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BellRing className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h2 className="text-base font-bold tracking-tight">
            Real-Time Price & Macro News Alerts
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded font-mono ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            {alerts.filter(a => a.active).length} Active Watchers
          </span>
        </div>

        <button
          onClick={onTriggerTestAlert}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-[2px] border font-mono transition cursor-pointer ${
            isDark 
              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' 
              : 'border-cyan-600/30 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
          }`}
          title="Play alert sound & simulate real-time price trigger"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Simulate Audio Ping</span>
        </button>
      </div>

      {/* Main Container: Split Form + Active Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Instant Alert Builder Form (Visible directly, no popups) */}
        <form
          onSubmit={handleCreate}
          className={`p-4 rounded-[2px] border space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
              Create Live Price Alert
            </span>
            {selectedAsset && (
              <span className="text-xs font-mono text-slate-400">
                Current: <strong className="text-slate-200">{selectedAsset.displayPrice}</strong>
              </span>
            )}
          </div>

          {/* Select Symbol */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Asset Symbol
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {watchlist.slice(0, 6).map((asset) => (
                <button
                  type="button"
                  key={asset.symbol}
                  onClick={() => handleAssetSelect(asset.symbol)}
                  className={`py-1 px-1.5 rounded-[2px] border text-center transition cursor-pointer ${
                    symbol === asset.symbol
                      ? isDark 
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-bold' 
                        : 'border-cyan-600 bg-cyan-50 text-cyan-800 font-bold'
                      : isDark 
                        ? 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {asset.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Condition: Above vs Below */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Trigger Condition
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`py-1.5 rounded-[2px] border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  condition === 'above'
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400 font-bold'
                    : isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Rises Above (≥)</span>
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`py-1.5 rounded-[2px] border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  condition === 'below'
                    ? 'border-rose-500/50 bg-rose-500/20 text-rose-400 font-bold'
                    : isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Falls Below (≤)</span>
              </button>
            </div>
          </div>

          {/* Target Price input */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Target Price Threshold
            </label>
            <input
              type="text"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 2860.00"
              className={`w-full py-2 px-3 rounded-[2px] border font-mono text-sm focus:outline-hidden focus:ring-1 focus:ring-cyan-500 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-[2px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-cyan-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Arm Real-Time Price Alert</span>
          </button>
        </form>

        {/* Right 2 Columns: Live Alerts List */}
        <div 
          className={`lg:col-span-2 p-4 rounded-[2px] border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Triggers & News Watchers ({alerts.length})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Real-time tick monitored
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No price alerts set. Use the form on the left or click "+ Alert" on any watchlist pair!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  id={`alert-item-${alert.id}`}
                  className={`p-3 rounded-[2px] border flex items-center justify-between gap-2 text-xs font-mono transition ${
                    alert.triggered
                      ? isDark ? 'border-amber-500/50 bg-amber-500/10' : 'border-amber-400 bg-amber-50'
                      : isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">
                        {alert.symbol}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[2px] ${
                        alert.condition === 'above'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {alert.condition === 'above' ? '≥ ABOVE' : '≤ BELOW'}
                      </span>
                    </div>

                    <div className="text-sm font-extrabold text-cyan-400">
                      ${alert.targetPrice.toLocaleString()}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      {alert.triggered 
                        ? <span className="text-amber-400 font-bold">⚡ Triggered ({alert.triggeredAt || 'Recently'})</span>
                        : `Set when price was $${alert.createdPrice}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Active state */}
                    <button
                      onClick={() => onToggleAlertActive(alert.id)}
                      className={`px-2 py-1 rounded-[2px] text-[11px] font-semibold transition cursor-pointer border ${
                        alert.active
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-700 bg-slate-800 text-slate-500'
                      }`}
                      title={alert.active ? 'Mute alert' : 'Activate alert'}
                    >
                      {alert.active ? 'ACTIVE' : 'MUTED'}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer rounded-[2px]"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
