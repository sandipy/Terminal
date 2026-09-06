import React from 'react';
import { HistoricalImpactStat, DriverType, WatchlistAsset } from '../types';
import { CorrelationHeatmap } from './CorrelationHeatmap';
import { 
  Zap, 
  ArrowRight, 
  Flame, 
  Activity, 
  Gauge, 
  Layers,
  Fish,
  Building2,
  BarChart3,
  Waves
} from 'lucide-react';

interface CauseReactionHubProps {
  isDark: boolean;
  historicalStats: HistoricalImpactStat[];
  activeVolatilityScore?: number; // 0 - 100
  watchlist?: WatchlistAsset[];
}

export const CauseReactionHub: React.FC<CauseReactionHubProps> = ({
  isDark,
  historicalStats,
  activeVolatilityScore = 74,
  watchlist = [],
}) => {
  const goldAsset = watchlist.find(a => a.symbol === 'XAU/USD');
  const oilAsset = watchlist.find(a => a.symbol === 'WTI/USD');

  const goldPriceDisplay = goldAsset ? goldAsset.displayPrice : '$4,520.30';
  const goldChangePercent = goldAsset ? goldAsset.changePercent : -0.43;
  const isGoldPositive = goldChangePercent >= 0;

  const oilPriceDisplay = oilAsset ? oilAsset.displayPrice : '$91.95';
  const oilChangePercent = oilAsset ? oilAsset.changePercent : 0.71;
  const isOilPositive = oilChangePercent >= 0;

  return (
    <div id="cause-reaction-hub" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          <h2 className="text-base font-bold tracking-tight">
            Cause & Reaction Engine: Macro News vs Asset Reaction
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded font-mono ${
            isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            Macro Catalysts = Cause • Prices = Reaction
          </span>
        </div>

        {/* Live News Volatility Meter */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-mono ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <Gauge className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>News Volatility Index:</span>
          <span className="font-extrabold text-amber-500">{activeVolatilityScore}/100</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
            High Impact
          </span>
        </div>
      </div>

      {/* Side-by-Side Commodity Intelligence: Gold & Oil Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gold Analysis Card */}
        <div 
          id="gold-cause-reaction-card"
          className={`rounded-xl border p-4 transition ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50" />
              <h3 className="text-sm font-bold tracking-tight">
                Gold (XAU/USD): Macro Driver & Inflow Breakdown
              </h3>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              isGoldPositive 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              {goldPriceDisplay} ({isGoldPositive ? '+' : ''}{goldChangePercent}%)
            </span>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            {/* Cause -> Reaction flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  Macro Cause (Forex Factory)
                </span>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  US Core CPI beat (0.3% vs 0.2%) pushed US 10-year yields higher, normally a direct sell-off trigger for non-yielding bullion.
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">
                  The Overriding Reaction Driver
                </span>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  <strong className="text-purple-300 font-bold">Whale Buying:</strong> Eastern central banks & sovereign wealth funds stepped in to absorb all dips at $4,500, counterbalancing the CPI yields spike.
                </p>
              </div>
            </div>

            {/* Classification & Verdict */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1 text-slate-400">
                <Fish className="w-3.5 h-3.5 text-purple-400" />
                <span>Primary Classification:</span>
                <span className="font-bold text-purple-400">Whale Physical Inflows</span>
              </div>
              <span className="text-slate-400">
                Market Noise vs Real Shift: <strong className="text-emerald-400">Major Fundamental Trend</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Crude Oil Analysis Card */}
        <div 
          id="oil-cause-reaction-card"
          className={`rounded-xl border p-4 transition ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-500 shadow-xs shadow-cyan-500/50" />
              <h3 className="text-sm font-bold tracking-tight">
                Crude Oil (WTI): Macro Driver & Inventory Breakdown
              </h3>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              isOilPositive 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              {oilPriceDisplay} ({isOilPositive ? '+' : ''}{oilChangePercent}%)
            </span>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            {/* Cause -> Reaction flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  Macro Cause (Forex Factory)
                </span>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  EIA Crude Inventories surprised with a massive +3.8M barrel build (vs -1.2M forecast) confirming elevated domestic refining slack.
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-0.5">
                  The Overriding Reaction Driver
                </span>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  <strong className="text-cyan-300 font-bold">Refiner Absorption:</strong> Global aviation distillate demand and geopolitical transport risk premia keep buyers defending $91.00 prompt futures.
                </p>
              </div>
            </div>

            {/* Classification & Verdict */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1 text-slate-400">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Primary Classification:</span>
                <span className="font-bold text-amber-400">Macro Inventory Release</span>
              </div>
              <span className="text-slate-400">
                Market Noise vs Real Shift: <strong className="text-amber-400">Active Supply-Demand Balance</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Correlation Heatmap (Intermarket Relationship Matrix for Gold, Oil, DXY & FX Pairs) */}
      <CorrelationHeatmap isDark={isDark} />

      {/* Historical Trend Analysis: How News Events Impact Volatility in Real-Time */}
      <div 
        id="historical-volatility-visualizer"
        className={`rounded-xl border p-4 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              Historical Volatility Trend Analysis: News Shock vs Pip Volatility
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Quantified pip reactions & asset deviations per Forex Factory event release
            </p>
          </div>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            Based on 24-Month Central Bank & Macro Backtests
          </span>
        </div>

        {/* Visualized Grid of Events and Volatility Spikes */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {historicalStats.map((stat) => (
            <div
              key={stat.eventType}
              className={`p-3 rounded-lg border text-xs space-y-2 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-sm tracking-tight">
                  {stat.eventType}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  stat.currency === 'USD' 
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' 
                    : 'bg-emerald-500/15 text-emerald-400'
                }`}>
                  {stat.currency}
                </span>
              </div>

              {/* Volatility Bar Indicator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Avg Volatility:</span>
                  <span className="font-bold text-amber-400">{stat.avgVolatilityPips} pips</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${Math.min(100, (stat.avgVolatilityPips / 150) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Normal: 25 pips</span>
                  <span>Max Spike: {stat.maxVolatilityPips} pips</span>
                </div>
              </div>

              {/* Commodity Reactions */}
              <div className={`pt-2 border-t text-[11px] space-y-1 font-mono ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className="text-amber-400">Gold Move:</span>
                  <span className="font-semibold">{stat.goldReactionAvg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Oil Move:</span>
                  <span className="font-semibold">{stat.oilReactionAvg}</span>
                </div>
              </div>

              {/* Historical Context Note */}
              <p className={`text-[11px] leading-relaxed pt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {stat.lastReactionSummary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
