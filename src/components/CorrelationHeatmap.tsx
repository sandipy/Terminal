import React, { useState } from 'react';
import { 
  CORRELATION_ASSETS, 
  PAIR_CORRELATIONS, 
  CORRELATION_KEY_INSIGHTS, 
  getPairCorrelation, 
  PairCorrelationDetail,
  CorrelationAsset
} from '../data/correlationData';
import { 
  Grid3X3, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  Zap, 
  Layers, 
  Filter,
  CheckCircle2,
  HelpCircle,
  BarChart2
} from 'lucide-react';

interface CorrelationHeatmapProps {
  isDark: boolean;
}

type RegimeType = 'rolling30d' | 'structural90d' | 'inflationRegime';
type AssetFilterType = 'all' | 'commodities' | 'usd_pairs';

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ isDark }) => {
  const [selectedRegime, setSelectedRegime] = useState<RegimeType>('rolling30d');
  const [assetFilter, setAssetFilter] = useState<AssetFilterType>('all');
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string } | null>(null);
  const [selectedPair, setSelectedPair] = useState<PairCorrelationDetail>(() => {
    return getPairCorrelation('XAU/USD', 'DXY')!;
  });

  // Filter assets depending on selected tab
  const displayedAssets: CorrelationAsset[] = CORRELATION_ASSETS.filter(asset => {
    if (assetFilter === 'commodities') {
      return asset.symbol === 'XAU/USD' || asset.symbol === 'WTI/USD' || asset.symbol === 'DXY' || asset.symbol === 'AUD/USD';
    }
    if (assetFilter === 'usd_pairs') {
      return asset.symbol !== 'XAU/USD' && asset.symbol !== 'WTI/USD';
    }
    return true;
  });

  // Helper to get correlation value based on regime
  const getCorrelationValue = (pair: PairCorrelationDetail | null): number => {
    if (!pair) return 0;
    if (selectedRegime === 'rolling30d') return pair.rolling30d;
    if (selectedRegime === 'structural90d') return pair.structural90d;
    return pair.inflationRegime;
  };

  // Color mapping logic for correlation coefficients (-1.0 to 1.0)
  const getCellStyling = (val: number, isSelf: boolean) => {
    if (isSelf) {
      return isDark 
        ? 'bg-slate-800/80 text-slate-300 font-bold border-slate-700/60' 
        : 'bg-slate-100 text-slate-600 font-bold border-slate-200';
    }

    if (val >= 0.70) {
      return isDark
        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/40 font-black shadow-xs shadow-emerald-500/10'
        : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 font-black';
    }
    if (val >= 0.30) {
      return isDark
        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25 font-semibold'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-semibold';
    }
    if (val > -0.30) {
      return isDark
        ? 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 font-normal'
        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 font-normal';
    }
    if (val > -0.70) {
      return isDark
        ? 'bg-rose-500/15 text-rose-400 border-rose-500/20 hover:bg-rose-500/25 font-semibold'
        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-semibold';
    }
    // Strong negative (<= -0.70)
    return isDark
      ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 hover:bg-rose-500/40 font-black shadow-xs shadow-rose-500/10'
      : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200 font-black';
  };

  const handleCellClick = (assetA: string, assetB: string) => {
    const detail = getPairCorrelation(assetA, assetB);
    if (detail) {
      setSelectedPair(detail);
    }
  };

  return (
    <div 
      id="correlation-heatmap-matrix" 
      className={`rounded-[2px] border p-4 sm:p-5 transition space-y-5 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Component Header with Explanatory Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-[2px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Grid3X3 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Intermarket Correlation Heatmap</span>
              <span className="text-xs px-2 py-0.5 rounded-[2px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Gold • Oil • DXY • Major FX
              </span>
            </h3>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Quantifies statistical co-movements (-1.00 to +1.00). Discover whether Gold and Oil are acting as pure dollar inverses or independent macro catalysts.
          </p>
        </div>

        {/* View Controls: Regime & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Regime Selector */}
          <div className={`flex items-center p-1 rounded-[2px] border text-xs font-mono ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setSelectedRegime('rolling30d')}
              className={`px-2.5 py-1 rounded-[2px] transition cursor-pointer font-semibold ${
                selectedRegime === 'rolling30d'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30D Rolling (Spot)
            </button>
            <button
              onClick={() => setSelectedRegime('structural90d')}
              className={`px-2.5 py-1 rounded-[2px] transition cursor-pointer font-semibold ${
                selectedRegime === 'structural90d'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90D Structural
            </button>
            <button
              onClick={() => setSelectedRegime('inflationRegime')}
              className={`px-2.5 py-1 rounded-[2px] transition cursor-pointer font-semibold flex items-center gap-1 ${
                selectedRegime === 'inflationRegime'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Inflation Spike</span>
            </button>
          </div>

          {/* Asset Focus Filter */}
          <div className={`flex items-center p-1 rounded-[2px] border text-xs font-mono ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setAssetFilter('all')}
              className={`px-2 py-1 rounded-[2px] transition cursor-pointer ${
                assetFilter === 'all'
                  ? 'bg-slate-800 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setAssetFilter('commodities')}
              className={`px-2 py-1 rounded-[2px] transition cursor-pointer ${
                assetFilter === 'commodities'
                  ? 'bg-slate-800 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Commodities Focus
            </button>
            <button
              onClick={() => setAssetFilter('usd_pairs')}
              className={`px-2 py-1 rounded-[2px] transition cursor-pointer ${
                assetFilter === 'usd_pairs'
                  ? 'bg-slate-800 text-blue-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              USD & FX Only
            </button>
          </div>
        </div>
      </div>

      {/* 4 Instant Key Takeaway Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {CORRELATION_KEY_INSIGHTS.map((insight, idx) => (
          <div 
            key={idx}
            className={`p-3 rounded-[2px] border text-xs space-y-1 transition ${
              isDark ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 font-mono text-[11px] truncate">
                {insight.title}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] font-bold uppercase ${
                insight.color === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                insight.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                insight.color === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {insight.badge}
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {insight.summary}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN GRID & DEEP DIVE SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* LEFT / CENTER: THE COLOR-CODED MATRIX (7 Cols on XL) */}
        <div className="xl:col-span-7 space-y-3">
          
          <div className="overflow-x-auto pb-2">
            <table className="w-full border-collapse select-none min-w-[540px]">
              <thead>
                <tr>
                  {/* Top-left empty intersection corner */}
                  <th className="p-2 text-left text-[11px] font-mono font-bold text-slate-500 border-b border-slate-800">
                    Pair Intersect
                  </th>
                  {displayedAssets.map((colAsset) => {
                    const isColHovered = hoveredCell?.col === colAsset.symbol;
                    const isSelected = selectedPair.assetA === colAsset.symbol || selectedPair.assetB === colAsset.symbol;
                    return (
                      <th 
                        key={colAsset.symbol}
                        className={`p-2 text-center text-xs font-mono font-bold border-b transition ${
                          isColHovered || isSelected 
                            ? 'text-cyan-400 border-cyan-500 bg-cyan-500/10' 
                            : isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'
                        }`}
                        title={`${colAsset.name} (${colAsset.tag})`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-mono text-xs">{colAsset.symbol}</span>
                          <span className="text-[9px] font-normal text-slate-500 truncate max-w-[55px]">
                            {colAsset.category === 'commodity' ? 'COMM' : colAsset.category === 'dollar_index' ? 'INDEX' : 'FX'}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {displayedAssets.map((rowAsset) => {
                  const isRowHovered = hoveredCell?.row === rowAsset.symbol;
                  return (
                    <tr key={rowAsset.symbol} className="transition hover:bg-slate-800/20">
                      {/* Row Header */}
                      <th 
                        className={`p-2 text-left text-xs font-mono font-bold border-r transition pr-3 whitespace-nowrap ${
                          isRowHovered 
                            ? 'text-cyan-400 border-cyan-500 bg-cyan-500/10' 
                            : isDark ? 'text-slate-300 border-slate-800/80' : 'text-slate-700 border-slate-200'
                        }`}
                        title={`${rowAsset.name} — ${rowAsset.role}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-[1px] ${
                            rowAsset.category === 'commodity' ? 'bg-amber-400' :
                            rowAsset.category === 'dollar_index' ? 'bg-cyan-400' : 'bg-blue-400'
                          }`} />
                          <span>{rowAsset.symbol}</span>
                        </div>
                      </th>

                      {/* Matrix Value Cells */}
                      {displayedAssets.map((colAsset) => {
                        const isSelf = rowAsset.symbol === colAsset.symbol;
                        const pair = getPairCorrelation(rowAsset.symbol, colAsset.symbol);
                        const val = getCorrelationValue(pair);
                        const isHovered = (hoveredCell?.row === rowAsset.symbol && hoveredCell?.col === colAsset.symbol) ||
                                          (hoveredCell?.row === colAsset.symbol && hoveredCell?.col === rowAsset.symbol);
                        const isSelectedPair = (selectedPair.assetA === rowAsset.symbol && selectedPair.assetB === colAsset.symbol) ||
                                               (selectedPair.assetA === colAsset.symbol && selectedPair.assetB === rowAsset.symbol);

                        return (
                          <td 
                            key={colAsset.symbol}
                            onMouseEnter={() => setHoveredCell({ row: rowAsset.symbol, col: colAsset.symbol })}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => handleCellClick(rowAsset.symbol, colAsset.symbol)}
                            className="p-1 text-center cursor-pointer"
                          >
                            <div 
                              className={`h-10 sm:h-11 rounded-[2px] border text-xs sm:text-sm font-mono flex flex-col items-center justify-center transition-all ${
                                getCellStyling(val, isSelf)
                              } ${
                                isHovered ? 'scale-105 ring-2 ring-cyan-400 z-10' : ''
                              } ${
                                isSelectedPair && !isSelf ? 'ring-2 ring-white shadow-md' : ''
                              }`}
                            >
                              <span className="font-raleway font-bold">
                                {isSelf ? '1.00' : (val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2))}
                              </span>
                              <span className="text-[9px] font-sans opacity-75">
                                {isSelf ? 'Self' : Math.abs(val) >= 0.7 ? 'Strong' : Math.abs(val) >= 0.3 ? 'Mod' : 'Low'}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Color Scale Legend Bar */}
          <div className={`p-3 rounded-[2px] border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-slate-400 font-semibold text-[11px]">
              Correlation Scale (Pearson r):
            </span>

            {/* Gradient Spectrum Legend */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-[1px] bg-rose-600/40 border border-rose-500/50 inline-block" />
                <span className="text-[10px] text-rose-300">-1.0 (Strong Inverse)</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-[1px] bg-rose-500/15 border border-rose-500/20 inline-block" />
                <span className="text-[10px] text-rose-400">-0.5</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-[1px] bg-slate-800/60 border border-slate-700 inline-block" />
                <span className="text-[10px] text-slate-400">0.0 (Uncorrelated)</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-[1px] bg-emerald-500/15 border border-emerald-500/20 inline-block" />
                <span className="text-[10px] text-emerald-400">+0.5</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-[1px] bg-emerald-600/40 border border-emerald-500/50 inline-block" />
                <span className="text-[10px] text-emerald-300">+1.0 (Strong Positive)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE PAIRWISE MACRO DEEP-DIVE (5 Cols on XL) */}
        <div className="xl:col-span-5 space-y-4">
          <div 
            id="pair-correlation-inspector"
            className={`p-4 rounded-[2px] border space-y-4 transition ${
              isDark ? 'bg-slate-950/90 border-slate-800 shadow-md' : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            {/* Header: Selected Pair & Large Correlation Display */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-0.5">
                  Inspected Relationship
                </span>
                <div className="font-raleway font-black text-xl text-white flex items-center gap-2">
                  <span>{selectedPair.assetA}</span>
                  <ArrowRightLeft className="w-4 h-4 text-slate-500" />
                  <span>{selectedPair.assetB}</span>
                </div>
              </div>

              {/* Big Correlation Pill */}
              <div className="text-right">
                <div className={`font-raleway font-black text-2xl font-mono ${
                  getCorrelationValue(selectedPair) >= 0.3 ? 'text-emerald-400' :
                  getCorrelationValue(selectedPair) <= -0.3 ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {getCorrelationValue(selectedPair) >= 0 ? `+${getCorrelationValue(selectedPair).toFixed(2)}` : getCorrelationValue(selectedPair).toFixed(2)}
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold uppercase inline-block ${
                  getCorrelationValue(selectedPair) >= 0.70 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  getCorrelationValue(selectedPair) >= 0.30 ? 'bg-emerald-500/10 text-emerald-400' :
                  getCorrelationValue(selectedPair) > -0.30 ? 'bg-slate-800 text-slate-400' :
                  getCorrelationValue(selectedPair) > -0.70 ? 'bg-rose-500/10 text-rose-400' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {selectedPair.strengthLabel}
                </span>
              </div>
            </div>

            {/* Regime Breakdown Triple Pill */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className={`p-2 rounded-[2px] border ${
                selectedRegime === 'rolling30d' 
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <span className="block text-[9px] uppercase">30D Rolling</span>
                <span className="text-sm">
                  {selectedPair.rolling30d >= 0 ? `+${selectedPair.rolling30d.toFixed(2)}` : selectedPair.rolling30d.toFixed(2)}
                </span>
              </div>

              <div className={`p-2 rounded-[2px] border ${
                selectedRegime === 'structural90d' 
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <span className="block text-[9px] uppercase">90D Structural</span>
                <span className="text-sm">
                  {selectedPair.structural90d >= 0 ? `+${selectedPair.structural90d.toFixed(2)}` : selectedPair.structural90d.toFixed(2)}
                </span>
              </div>

              <div className={`p-2 rounded-[2px] border ${
                selectedRegime === 'inflationRegime' 
                  ? 'bg-amber-950/50 border-amber-500 text-amber-300 font-bold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}>
                <span className="block text-[9px] uppercase">Inflation Spike</span>
                <span className="text-sm">
                  {selectedPair.inflationRegime >= 0 ? `+${selectedPair.inflationRegime.toFixed(2)}` : selectedPair.inflationRegime.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Institutional Macro Rationale */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                <Info className="w-3 h-3" /> Fundamental Macro Cause:
              </span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedPair.macroRationale}
              </p>
            </div>

            {/* Intermarket Flow Mechanism */}
            <div className="space-y-1 text-xs p-2.5 rounded-[2px] bg-slate-900/70 border border-slate-800 font-mono">
              <span className="text-[10px] uppercase text-cyan-400 font-bold block">
                Physical Liquidity Mechanism:
              </span>
              <p className="text-slate-300 leading-normal text-[11px]">
                {selectedPair.intermarketMechanism}
              </p>
            </div>

            {/* Divergence Warning & Trading Implication */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-[2px] bg-rose-950/30 border border-rose-800/40 text-rose-200">
                <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-rose-400 mb-0.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Divergence / Breakout Alert:</span>
                </div>
                <p className="text-[11px] leading-snug">
                  {selectedPair.divergenceAlert}
                </p>
              </div>

              <div className="p-2.5 rounded-[2px] bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
                <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-emerald-400 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Actionable Trader Rule:</span>
                </div>
                <p className="text-[11px] leading-snug font-medium">
                  {selectedPair.actionableTradingRule}
                </p>
              </div>
            </div>

            {/* Hint to click other cells */}
            <div className="text-center pt-1 text-[10px] font-mono text-slate-500">
              💡 Click any cell on the matrix to inspect intermarket flows and trading rules.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
