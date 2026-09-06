import React from 'react';
import { WatchlistAsset, DriverType } from '../types';
import { getAssetVerdict } from '../utils/verdictHelper';
import { 
  TrendingUp, 
  TrendingDown, 
  Fish, 
  Building2, 
  BarChart2, 
  Activity,
  BellPlus,
  Compass,
  Sparkles,
  Flame
} from 'lucide-react';

interface WatchlistGridProps {
  assets: WatchlistAsset[];
  isDark: boolean;
  onSelectForAlert: (asset: WatchlistAsset) => void;
  selectedAssetSymbol?: string;
  onSelectAsset?: (symbol: string) => void;
  onToggleSignalsOnly?: () => void;
}

export const WatchlistGrid: React.FC<WatchlistGridProps> = ({
  assets,
  isDark,
  onSelectForAlert,
  selectedAssetSymbol,
  onSelectAsset,
  onToggleSignalsOnly,
}) => {

  const getDriverBadge = (driver: DriverType) => {
    switch (driver) {
      case 'whale':
        return {
          label: 'Whale Buying / Flow',
          icon: <Fish className="w-3.5 h-3.5 text-purple-400" />,
          classes: isDark 
            ? 'border-purple-500/50 bg-purple-500/20 text-purple-200' 
            : 'border-purple-500/40 bg-purple-50 text-purple-800',
        };
      case 'institutional':
        return {
          label: 'Institutional COT Flow',
          icon: <Building2 className="w-3.5 h-3.5 text-blue-400" />,
          classes: isDark 
            ? 'border-blue-500/50 bg-blue-500/20 text-blue-200' 
            : 'border-blue-500/40 bg-blue-50 text-blue-800',
        };
      case 'macro':
        return {
          label: 'Macro Data Release',
          icon: <BarChart2 className="w-3.5 h-3.5 text-amber-400" />,
          classes: isDark 
            ? 'border-amber-500/50 bg-amber-500/20 text-amber-200' 
            : 'border-amber-500/40 bg-amber-50 text-amber-900',
        };
      case 'noise':
      default:
        return {
          label: 'Minor Noise / Range',
          icon: <Activity className="w-3.5 h-3.5 text-slate-400" />,
          classes: isDark 
            ? 'border-slate-700 bg-slate-800/80 text-slate-300' 
            : 'border-slate-300 bg-slate-100 text-slate-700',
        };
    }
  };

  return (
    <div id="watchlist-section" className="space-y-3.5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Compass className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h2 className="text-xl font-black tracking-tight">
            Major Watchlist & Price Reaction Radar
          </h2>
          <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
          }`}>
            Live Feeds • 1-Word Macro Signals
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold font-mono">
          {onToggleSignalsOnly && (
            <button
              onClick={onToggleSignalsOnly}
              className="px-3 py-1.5 rounded-[2px] border border-amber-500/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 flex items-center gap-1.5 text-xs font-black tracking-tight transition cursor-pointer shadow-md shadow-amber-500/10"
              title="One click button to remove all details and show ONLY Hot Buy / Hot Sell / Buy / Sell / Neutral"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>⚡ 1-Click Signals Only</span>
            </button>
          )}

          <span className="hidden sm:flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[1px] bg-emerald-500" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Hot Buy / Bullish</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[1px] bg-rose-500" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Hot Sell / Bearish</span>
          </span>
        </div>
      </div>

      {/* Grid of Cards - Visible at one glance with all drivers exposed */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {assets.map((asset) => {
          const isUp = asset.change24h >= 0;
          const driverInfo = getDriverBadge(asset.primaryDriver);
          const isSelected = selectedAssetSymbol === asset.symbol;
          const verdict = getAssetVerdict(asset);

          return (
            <div
              key={asset.symbol}
              id={`watchlist-card-${asset.symbol.replace('/', '-')}`}
              onClick={() => onSelectAsset && onSelectAsset(asset.symbol)}
              className={`rounded-[2px] border p-5 transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-cyan-500 border-cyan-500 shadow-xl' 
                  : ''
              } ${
                isDark 
                  ? 'bg-slate-900/95 border-slate-800 hover:border-slate-700 hover:bg-slate-900' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Card Header: Symbol, Category, Price, 24h Change */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xl lg:text-2xl font-black tracking-tight font-mono">
                      {asset.symbol}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${
                      asset.category === 'commodity'
                        ? isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-800'
                        : isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {asset.category}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {asset.name}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl lg:text-3xl font-black font-mono tracking-tight">
                    {asset.displayPrice}
                  </div>
                  <div className={`flex items-center justify-end gap-1.5 text-sm font-mono font-bold ${
                    isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
                    <span className="text-xs opacity-80">
                      ({isUp ? '+' : ''}{asset.pipChange} {asset.category === 'commodity' ? 'pts' : 'pips'})
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-WORD VERDICT / CONVICTION BANNER (MUCH BIGGER FONT) */}
              <div className="mt-3.5 mb-2">
                <div className={`flex items-center justify-between px-3.5 py-2 rounded-[2px] border ${verdict.badgeClasses}`}>
                  <div className="flex items-center gap-2">
                    {verdict.isHot ? (
                      <Flame className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                    )}
                    <span className="font-raleway font-black text-lg lg:text-xl tracking-wider uppercase">
                      {verdict.oneWord}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-sm lg:text-base tracking-tight">
                      {verdict.shortTag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver Badge - Prominently Displayed */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-[2px] border text-xs font-bold ${driverInfo.classes}`}>
                  {driverInfo.icon}
                  <span>{driverInfo.label}</span>
                </div>

                {/* Quick Alert Bell button */}
                <button
                  id={`btn-alert-${asset.symbol.replace('/', '-')}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectForAlert(asset);
                  }}
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-[2px] border transition cursor-pointer ${
                    isDark 
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/50' 
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-cyan-700 hover:border-cyan-300'
                  }`}
                  title="Add price alert for this asset"
                >
                  <BellPlus className="w-3.5 h-3.5 text-cyan-500" />
                  <span>+ Alert</span>
                </button>
              </div>

              {/* Cause & "Why It's Moving" Section - Visible at one glance */}
              <div className={`mt-3 p-3 rounded-[2px] text-sm leading-relaxed border ${
                isDark 
                  ? 'bg-slate-950/70 border-slate-800 text-slate-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-1 text-cyan-400">
                  <span>Why It's Moving:</span>
                </div>
                <p className="font-medium text-xs lg:text-sm">{asset.whyItsMoving}</p>
              </div>

              {/* Sentiment Visualizer (% Long vs % Short) */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-400">
                    Long {asset.sentimentLongPercent}%
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                    Retail Sentiment
                  </span>
                  <span className="text-rose-400">
                    {asset.sentimentShortPercent}% Short
                  </span>
                </div>

                {/* Visual Ratio Bar */}
                <div className="h-2 w-full bg-slate-800 rounded-[2px] overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${asset.sentimentLongPercent}%` }} 
                  />
                  <div 
                    className="bg-rose-500 h-full transition-all duration-500" 
                    style={{ width: `${asset.sentimentShortPercent}%` }} 
                  />
                </div>
              </div>

              {/* Bottom Metadata: Whale Activity, Institutional Bias, Levels */}
              <div className={`mt-3 pt-2.5 border-t grid grid-cols-2 gap-2 text-xs font-mono ${
                isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'
              }`}>
                <div>
                  <span className="block text-[11px] uppercase text-slate-500 font-bold">Whale Flow:</span>
                  <span className={`font-bold ${
                    asset.whaleActivityLevel === 'High' 
                      ? 'text-purple-300' 
                      : asset.whaleActivityLevel === 'Moderate' 
                        ? 'text-blue-300' 
                        : 'text-slate-300'
                  }`}>
                    {asset.whaleActivityLevel} • {asset.volumeStatus || 'Normal Vol'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] uppercase text-slate-500 font-bold">Stance / RSI:</span>
                  <span className={`font-bold ${
                    (asset.technicalStance || '').includes('Bullish') 
                      ? 'text-emerald-300' 
                      : (asset.technicalStance || '').includes('Overbought')
                        ? 'text-amber-300'
                        : (asset.technicalStance || '').includes('Oversold')
                          ? 'text-blue-300'
                          : asset.technicalStance
                            ? 'text-rose-300'
                            : 'text-slate-200'
                  }`}>
                    {asset.technicalStance || asset.institutionalPositioning || 'Neutral'} (RSI {asset.rsi || 50})
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action: AI Deep Dive & Level */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-xs text-amber-300/90 font-mono font-bold truncate max-w-[200px]">
                  {asset.keySupportResistance}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectAsset) onSelectAsset(asset.symbol);
                    const desk = document.getElementById('ai-macro-desk-section');
                    if (desk) desk.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-black cursor-pointer transition text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Analysis</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
