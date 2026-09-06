import React, { useState } from 'react';
import { WatchlistAsset } from '../types';
import { getAssetVerdict, AssetVerdict, VerdictSignalGroup, isVerdictMatchingGroup } from '../utils/verdictHelper';
import { 
  Flame, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  BellPlus, 
  X, 
  Layers, 
  Filter,
  ChevronRight,
  LayoutGrid,
  List,
  Target
} from 'lucide-react';

interface SignalsOnlyBoardProps {
  assets: WatchlistAsset[];
  isDark: boolean;
  onSelectAsset?: (symbol: string) => void;
  onSelectForAlert?: (asset: WatchlistAsset) => void;
  onExitSignalsOnly: () => void;
}

export const SignalsOnlyBoard: React.FC<SignalsOnlyBoardProps> = ({
  assets,
  isDark,
  onSelectAsset,
  onSelectForAlert,
  onExitSignalsOnly,
}) => {
  const [filter, setFilter] = useState<VerdictSignalGroup>('ALL');
  const [displayMode, setDisplayMode] = useState<'cards' | 'matrix'>('cards');

  // Compute counts for all groups with explicit typing
  const verdictsMap = new Map<string, AssetVerdict>(assets.map(a => [a.symbol, getAssetVerdict(a)]));

  const totalCount = assets.length;
  const hotCount = assets.filter(a => verdictsMap.get(a.symbol)?.isHot).length;
  const buyCount = assets.filter(a => {
    const v = verdictsMap.get(a.symbol);
    return v?.signalGroup === 'BUY' || v?.signalGroup === 'HOT_BUY';
  }).length;
  const sellCount = assets.filter(a => {
    const v = verdictsMap.get(a.symbol);
    return v?.signalGroup === 'SELL' || v?.signalGroup === 'HOT_SELL';
  }).length;
  const neutralCount = assets.filter(a => verdictsMap.get(a.symbol)?.signalGroup === 'NEUTRAL').length;

  const filteredAssets = assets.filter(a => {
    const v = verdictsMap.get(a.symbol);
    if (!v) return true;
    return isVerdictMatchingGroup(v, filter);
  });

  return (
    <div id="signals-only-board" className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      {/* Top Banner with One-Click Close & Filter Controls */}
      <div className={`p-4 sm:p-6 rounded-[2px] border transition-all ${
        isDark 
          ? 'bg-slate-900/95 border-cyan-500/40 shadow-2xl shadow-cyan-950/30' 
          : 'bg-white border-cyan-500/50 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Header Title & Icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <h2 className="text-xl sm:text-3xl font-black font-raleway tracking-tight truncate">
                  Signals-Only Radar
                </h2>
                <span className="px-2.5 py-1 rounded-[2px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm uppercase tracking-wider shrink-0 whitespace-nowrap">
                  Details Hidden
                </span>
              </div>
              <p className={`text-xs sm:text-base font-medium truncate mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Pure <span className="text-emerald-400 font-extrabold">HOT BUY</span>, <span className="text-rose-400 font-extrabold">HOT SELL</span>, <span className="text-emerald-300 font-extrabold">BUY</span>, <span className="text-rose-300 font-extrabold">SELL</span> & <span className="text-slate-300 font-extrabold">NEUTRAL</span> verdicts.
              </p>
            </div>
          </div>

          {/* Action Row: Mode Switcher & Exit Button */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {/* Display Mode: Cards vs 1-Screen Matrix */}
            <div className={`p-1.5 rounded-[2px] border flex items-center gap-1.5 text-xs sm:text-sm font-bold ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setDisplayMode('cards')}
                className={`px-3 py-1.5 rounded-[2px] transition cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm ${
                  displayMode === 'cards'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Expanded Card View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setDisplayMode('matrix')}
                className={`px-3 py-1.5 rounded-[2px] transition cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm ${
                  displayMode === 'matrix'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Dense 1-Screen Matrix View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">1-Screen Matrix</span>
              </button>
            </div>

            {/* Quick Exit Button back to deep details */}
            <button
              id="btn-exit-signals-only"
              onClick={onExitSignalsOnly}
              className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[2px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-base tracking-tight transition shadow-md shadow-cyan-500/20 cursor-pointer shrink-0"
              title="Return to full dashboard"
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Full Details</span>
              <X className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs: Horizontal Scrolling Chip Row for Mobile & Wrap for Desktop */}
        <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800/80 flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar scrollbar-none pb-1">
          <span className={`text-xs sm:text-sm uppercase mr-1 flex items-center gap-1 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Filter:
          </span>

          {/* Tab: ALL */}
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap text-xs sm:text-sm ${
              filter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                : isDark 
                  ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600' 
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>All Discussed</span>
            <span className="opacity-80 font-bold">({totalCount})</span>
          </button>

          {/* Tab: HOT SIGNALS */}
          <button
            onClick={() => setFilter('HOT')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap text-xs sm:text-sm ${
              filter === 'HOT'
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-500/20'
                : isDark 
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25' 
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>Hot Only</span>
            <span className="font-bold">({hotCount})</span>
          </button>

          {/* Tab: BUYS */}
          <button
            onClick={() => setFilter('BUY')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap text-xs sm:text-sm ${
              filter === 'BUY'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/20'
                : isDark 
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400" />
            <span>Hot Buy & Buy</span>
            <span className="font-bold">({buyCount})</span>
          </button>

          {/* Tab: SELLS */}
          <button
            onClick={() => setFilter('SELL')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap text-xs sm:text-sm ${
              filter === 'SELL'
                ? 'bg-rose-500 text-white border-rose-400 font-black shadow-lg shadow-rose-500/20'
                : isDark 
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25' 
                  : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-400" />
            <span>Hot Sell & Sell</span>
            <span className="font-bold">({sellCount})</span>
          </button>

          {/* Tab: NEUTRAL */}
          <button
            onClick={() => setFilter('NEUTRAL')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] border transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap text-xs sm:text-sm ${
              filter === 'NEUTRAL'
                ? 'bg-slate-300 text-slate-950 border-slate-200 font-black shadow'
                : isDark 
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-slate-100' 
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-[2px] bg-slate-400" />
            <span>Neutral / Range</span>
            <span className="font-bold">({neutralCount})</span>
          </button>
        </div>
      </div>

      {/* DISPLAY MODE 1: VISUAL CARDS GRID (Responsive for Mobile and Desktop) */}
      {displayMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredAssets.map((asset) => {
            const verdict = getAssetVerdict(asset);
            const isUp = asset.changePercent >= 0;

            return (
              <div
                key={asset.symbol}
                id={`signal-card-${asset.symbol.replace('/', '-')}`}
                onClick={() => onSelectAsset && onSelectAsset(asset.symbol)}
                className={`p-4 sm:p-6 rounded-[2px] border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  verdict.isHot 
                    ? isDark 
                      ? 'bg-slate-900/95 border-amber-500/50 hover:border-amber-400 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/30' 
                      : 'bg-white border-amber-400 hover:border-amber-500 shadow-lg ring-1 ring-amber-400/30'
                    : isDark 
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Asset Header: Symbol & Category */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2 sm:mb-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white group-hover:text-cyan-400 transition">
                          {asset.symbol}
                        </span>
                        <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] border shrink-0 ${
                          asset.category === 'commodity'
                            ? isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200'
                            : isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}>
                          {asset.category}
                        </span>
                      </div>
                      <p className={`text-sm sm:text-base font-semibold truncate mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {asset.name}
                      </p>
                    </div>

                    {/* 24h Change Badge */}
                    <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-[2px] font-bold text-sm sm:text-base flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      isUp 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {isUp ? '+' : ''}{asset.changePercent}%
                    </span>
                  </div>

                  {/* Big Live Price */}
                  <div className="mt-2 mb-3.5 sm:mb-5 font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
                    {asset.displayPrice}
                  </div>

                  {/* GIANT 1-WORD VERDICT BANNER */}
                  <div className={`p-4 sm:p-5 rounded-[2px] border flex flex-col items-center justify-center text-center gap-1 sm:gap-1.5 shadow-xl ${verdict.badgeClasses}`}>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {verdict.isHot ? (
                        <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 animate-pulse" />
                      ) : (
                        <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-300" />
                      )}
                      <span className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-wider uppercase text-white">
                        {verdict.oneWord}
                      </span>
                    </div>
                    <span className="font-black text-xs sm:text-sm lg:text-base tracking-wide uppercase opacity-95">
                      {verdict.shortTag} CONVICTION
                    </span>
                  </div>

                  {/* Conviction Visual Gauge */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                        Bias: {verdict.sentimentLabel}
                      </span>
                      <span className={verdict.textClasses}>
                        {verdict.convictionPercent}%
                      </span>
                    </div>
                    <div className="h-2 sm:h-2.5 w-full bg-slate-800 rounded-[2px] overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-[2px] ${
                          verdict.sentimentLabel === 'Bullish'
                            ? 'bg-emerald-500'
                            : verdict.sentimentLabel === 'Bearish'
                              ? 'bg-rose-500'
                              : 'bg-slate-400'
                        }`}
                        style={{ width: `${verdict.convictionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Fast Alert + Deep Dive Trigger */}
                <div className="mt-4 pt-3.5 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {onSelectForAlert && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectForAlert(asset);
                      }}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2px] text-xs sm:text-sm font-bold border transition cursor-pointer ${
                        isDark 
                          ? 'border-slate-700 bg-slate-800 text-slate-200 hover:text-cyan-300 hover:border-cyan-500' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-cyan-700'
                      }`}
                    >
                      <BellPlus className="w-4 h-4 text-cyan-400" />
                      <span>+ Alert</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-cyan-400 group-hover:text-cyan-300 transition">
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DISPLAY MODE 2: DENSE 1-SCREEN MATRIX (Fits all 11 discussed assets on 1 screen without scrolling) */
        <div className={`rounded-[2px] border overflow-hidden ${
          isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs sm:text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'bg-slate-950/70 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <th className="py-3 px-4 sm:px-5">Asset</th>
                  <th className="py-3 px-3 sm:px-4">Live Price</th>
                  <th className="py-3 px-3 sm:px-4">24h Shift</th>
                  <th className="py-3 px-4 sm:px-5 text-center">Pure Signal Verdict</th>
                  <th className="py-3 px-4 sm:px-5">Conviction & Flow</th>
                  <th className="py-3 px-3 sm:px-4">Primary Driver</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map((asset) => {
                  const verdict = getAssetVerdict(asset);
                  const isUp = asset.changePercent >= 0;

                  return (
                    <tr
                      key={asset.symbol}
                      onClick={() => onSelectAsset && onSelectAsset(asset.symbol)}
                      className={`hover:bg-slate-800/40 transition cursor-pointer ${
                        verdict.isHot ? (isDark ? 'bg-amber-500/5' : 'bg-amber-50/50') : ''
                      }`}
                    >
                      {/* Asset Symbol & Name */}
                      <td className="py-3 px-4 sm:px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg sm:text-xl text-white">
                            {asset.symbol}
                          </span>
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-[2px] border ${
                            asset.category === 'commodity'
                              ? isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-200'
                              : isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {asset.category}
                          </span>
                        </div>
                        <div className={`text-xs sm:text-sm font-medium truncate max-w-[200px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {asset.name}
                        </div>
                      </td>

                      {/* Live Price */}
                      <td className="py-3 px-3 sm:px-4 font-black text-lg sm:text-xl text-white">
                        {asset.displayPrice}
                      </td>

                      {/* 24h Shift */}
                      <td className="py-3 px-3 sm:px-4 font-bold text-xs sm:text-sm">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] ${
                          isUp 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {isUp ? '+' : ''}{asset.changePercent}%
                        </span>
                      </td>

                      {/* Huge Pure Signal Verdict Badge */}
                      <td className="py-3 px-4 sm:px-5 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-[2px] font-black text-sm sm:text-base tracking-wider uppercase shadow-md ${verdict.badgeClasses}`}>
                          {verdict.isHot ? (
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-pulse" />
                          ) : (
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                          )}
                          <span>{verdict.oneWord}</span>
                        </span>
                      </td>

                      {/* Conviction & Flow */}
                      <td className="py-3 px-4 sm:px-5 w-48">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1.5">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                            {verdict.sentimentLabel}
                          </span>
                          <span className={verdict.textClasses}>
                            {verdict.convictionPercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-[2px] overflow-hidden">
                          <div 
                            className={`h-full rounded-[2px] ${
                              verdict.sentimentLabel === 'Bullish'
                                ? 'bg-emerald-500'
                                : verdict.sentimentLabel === 'Bearish'
                                  ? 'bg-rose-500'
                                  : 'bg-slate-400'
                            }`}
                            style={{ width: `${verdict.convictionPercent}%` }}
                          />
                        </div>
                      </td>

                      {/* Primary Driver */}
                      <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-300 truncate max-w-[220px]">
                        {asset.driver}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 sm:px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          {onSelectForAlert && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectForAlert(asset);
                              }}
                              className="px-3 py-1.5 rounded-[2px] text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                            >
                              <BellPlus className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Alert</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectAsset && onSelectAsset(asset.symbol)}
                            className="px-3 py-1.5 rounded-[2px] text-xs sm:text-sm font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Dense List Scanner */}
          <div className="md:hidden divide-y divide-slate-800/80">
            {filteredAssets.map((asset) => {
              const verdict = getAssetVerdict(asset);
              const isUp = asset.changePercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => onSelectAsset && onSelectAsset(asset.symbol)}
                  className={`p-3.5 transition cursor-pointer flex items-center justify-between gap-3 ${
                    verdict.isHot ? (isDark ? 'bg-amber-500/10' : 'bg-amber-50') : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg sm:text-xl text-white">
                        {asset.symbol}
                      </span>
                      <span className={`text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUp ? '+' : ''}{asset.changePercent}%
                      </span>
                    </div>
                    <div className="font-black text-xl sm:text-2xl text-white my-0.5">
                      {asset.displayPrice}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <span>Conviction: {verdict.convictionPercent}%</span>
                      <span>•</span>
                      <span className={isUp ? 'text-emerald-400' : 'text-rose-400'}>{verdict.sentimentLabel}</span>
                    </div>
                  </div>

                  {/* Huge 1-Word Verdict Badge */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className={`px-3.5 py-1.5 rounded-[2px] font-black text-xs sm:text-sm uppercase tracking-wider shadow-md ${verdict.badgeClasses}`}>
                      {verdict.oneWord}
                    </span>

                    {onSelectForAlert && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForAlert(asset);
                        }}
                        className="px-2.5 py-1 rounded-[2px] text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <BellPlus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Alert</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
