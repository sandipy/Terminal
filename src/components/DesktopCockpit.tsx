import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Target, 
  Layers, 
  Compass, 
  Flame, 
  BarChart3, 
  Building2, 
  Fish, 
  Volume2, 
  VolumeX, 
  Bell, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Radio,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Grid3X3
} from 'lucide-react';
import { CorrelationHeatmap } from './CorrelationHeatmap';
import { getAssetVerdict } from '../utils/verdictHelper';
import { 
  WatchlistAsset, 
  EconomicEvent, 
  PriceAlert, 
  AssetCluster,
  RealNewsItem,
  OnScreenAlertNotice 
} from '../types';

interface DesktopCockpitProps {
  watchlist: WatchlistAsset[];
  calendarEvents: EconomicEvent[];
  alerts: PriceAlert[];
  isDark: boolean;
  selectedAssetSymbol: string;
  onSelectAsset: (symbol: string) => void;
  onAddAlert: (symbol: string, condition: 'above' | 'below', targetPrice: number) => void;
  onFireTestAlert: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onSyncRealData: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
  newsItems: RealNewsItem[];
  activeNotices: OnScreenAlertNotice[];
  onDismissNotice: (id: string) => void;
  onToggleSignalsOnly?: () => void;
}

export const DesktopCockpit: React.FC<DesktopCockpitProps> = ({
  watchlist,
  calendarEvents,
  alerts,
  isDark,
  selectedAssetSymbol,
  onSelectAsset,
  onAddAlert,
  onFireTestAlert,
  isAudioOn,
  onToggleAudio,
  onSyncRealData,
  isSyncing,
  lastSyncTime,
  newsItems,
  activeNotices,
  onDismissNotice,
  onToggleSignalsOnly,
}) => {
  // Selected Cluster Filter: 'all' | 'commodities' | 'dollar_axis' | 'indices'
  const [activeCluster, setActiveCluster] = useState<'all' | AssetCluster>('all');
  
  // Mobile Stage View: 'radar' (cluster asset cards) vs 'intel' (deep-dive right panel)
  const [mobileStage, setMobileStage] = useState<'radar' | 'intel'>('radar');

  // Right Stage Tab: 'focus' | 'calendar' | 'ai' | 'dictionary' | 'correlations'
  const [rightTab, setRightTab] = useState<'focus' | 'calendar' | 'ai' | 'dictionary' | 'correlations'>('focus');

  // Quick Alert Form for selected asset
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>('');
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string | null>(null);

  // AI Scenario State
  const [aiScenarioText, setAiScenarioText] = useState('US Core CPI comes in 0.2% hotter than forecast');
  const [aiScenarioResult, setAiScenarioResult] = useState<any | null>(null);
  const [isSimulatingAi, setIsSimulatingAi] = useState(false);

  // Dictionary search
  const [dictSearch, setDictSearch] = useState('');

  // Currently inspected asset with complete fallback
  const currentAsset = (watchlist && watchlist.length > 0)
    ? (watchlist.find(a => a?.symbol === selectedAssetSymbol) || watchlist[0])
    : {
        symbol: 'XAU/USD',
        name: 'Gold Spot / US Dollar',
        displayPrice: '$4,520.30',
        price: 4520.3,
        changePercent: -0.43,
        technicalStance: 'Bullish Expansion',
        rsi: 64,
        institutionalBias: 'Institutional Buy',
        volumeStatus: 'High Rel Vol (1.9x Avg)',
        whaleFlow: 'Whale Limit Absorption at $4,500 (Over +$820M)',
        primaryDriver: 'whale',
        whyItsMoving: 'Whale physical bullion absorption at $4,500 & central bank reserves accumulation holding strong.',
        intermarketCorrelation: 'Positive +0.78 correlation with AUD/USD. Inverse to DXY (-0.84).',
        keySupportResistance: 'Sup: $4,500 | Res: $4,550',
        clusterId: 'commodities',
        clusterName: 'Gold & Commodity Bloc',
        clusterPairDescription: 'Pairs with AUD/USD & WTI Crude',
      };

  // Cluster definitions with rationale
  const clusters = [
    {
      id: 'commodities' as AssetCluster,
      name: 'Gold & Commodity Bloc',
      badge: 'GOLD + AUD/USD + WTI',
      color: 'amber',
      rationale: 'Real yield inverse sensitivity & sovereign reserve bullion bids. AUD/USD mirrors Gold; WTI Crude drives inflation input expectations.'
    },
    {
      id: 'dollar_axis' as AssetCluster,
      name: 'The Dollar Axis & Safe Havens',
      badge: 'DXY + EUR/USD + USD/CHF',
      color: 'cyan',
      rationale: 'The core global liquidity spine. EUR/USD (57.6% DXY weight) is the direct inverse mirror; USD/CHF safe haven captures European capital flight.'
    },
    {
      id: 'indices' as AssetCluster,
      name: 'US Equity Futures (MNQ & MES)',
      badge: 'MNQ (NASDAQ) + MES (S&P 500)',
      color: 'emerald',
      rationale: 'MNQ = Mega-Cap Tech Growth & Rate Sensitivity. MES = Broad US Corporate Baseline. The MNQ/MES ratio gauges Growth vs Defensive rotation.'
    }
  ];

  // Filter watchlist according to selected cluster with resilient fallback
  const rawFiltered = activeCluster === 'all' 
    ? (watchlist || []) 
    : (watchlist || []).filter(a => a && a.clusterId === activeCluster);
  const displayedAssets = (rawFiltered.length > 0 ? rawFiltered : (watchlist || [])).filter(Boolean);

  const handleCreateQuickAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(alertTargetPrice);
    if (!priceNum || isNaN(priceNum)) return;

    onAddAlert(currentAsset.symbol, alertCondition, priceNum);
    setAlertSuccessMsg(`Alert armed for ${currentAsset.symbol} ${alertCondition} ${priceNum}`);
    setAlertTargetPrice('');
    setTimeout(() => setAlertSuccessMsg(null), 3000);
  };

  const handleSimulateScenario = async () => {
    if (!aiScenarioText.trim()) return;
    setIsSimulatingAi(true);
    try {
      const res = await fetch('/api/ai/explain-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: `Macro Scenario: ${aiScenarioText}` }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiScenarioResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulatingAi(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-56px)] lg:h-[calc(100vh-56px)] flex flex-col font-raleway select-none overflow-y-auto lg:overflow-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. TOP TICKER & ON-SCREEN ALERT BANNER */}
      <div className={`shrink-0 px-3 sm:px-4 py-1.5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          {/* Active Notices if any */}
          {activeNotices.length > 0 ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium animate-pulse text-xs max-w-full">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold shrink-0">{activeNotices[0].title}:</span>
              <span className="truncate max-w-[200px] sm:max-w-[420px]">{activeNotices[0].message}</span>
              <button 
                onClick={() => onDismissNotice(activeNotices[0].id)}
                className="ml-1 text-[10px] underline hover:text-white cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="font-semibold text-slate-300 truncate">Live Institutional Orderflow & Macro Radar</span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 hidden md:inline">| Last Sync: {lastSyncTime}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto overflow-x-auto max-w-full pb-0.5">
          <button
            onClick={onToggleAudio}
            className={`px-2 py-1 rounded border flex items-center gap-1 text-[11px] font-medium transition cursor-pointer shrink-0 ${
              isAudioOn 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle audio alert chime"
          >
            {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Chime: {isAudioOn ? 'ON' : 'OFF'}</span>
            <span className="sm:hidden">{isAudioOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onFireTestAlert}
            className="hidden sm:flex px-2 py-1 rounded border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium transition cursor-pointer shrink-0"
            title="Test On-Screen Audio & Visual Trigger"
          >
            Test Alert
          </button>

          <button
            onClick={onSyncRealData}
            disabled={isSyncing}
            className={`px-2 sm:px-2.5 py-1 rounded border flex items-center gap-1.5 text-[11px] font-bold transition cursor-pointer shrink-0 ${
              isDark ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25' : 'bg-cyan-50 border-cyan-300 text-cyan-700 hover:bg-cyan-100'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Rates'}</span>
            <span className="sm:hidden">{isSyncing ? '...' : 'Sync'}</span>
          </button>

          {onToggleSignalsOnly && (
            <button
              id="btn-cockpit-signals-only"
              onClick={onToggleSignalsOnly}
              className="px-2.5 py-1 rounded-lg border border-amber-500/50 bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 hover:bg-amber-500/35 flex items-center gap-1.5 text-[11px] font-black transition cursor-pointer shadow-sm shadow-amber-500/20 shrink-0"
              title="One-click button to remove all details and show ONLY Hot Buy / Hot Sell / Buy / Sell / Neutral"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>⚡ Signals Only</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Stage Toggle Switch (Visible on screens < lg) */}
      <div className="lg:hidden shrink-0 px-2.5 pt-2">
        <div className={`p-1 rounded-[2px] border flex items-center gap-1 text-xs font-bold ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setMobileStage('radar')}
            className={`flex-1 py-1.5 px-2 rounded-[2px] transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mobileStage === 'radar'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Asset Clusters ({watchlist.length})</span>
          </button>
          <button
            onClick={() => setMobileStage('intel')}
            className={`flex-1 py-1.5 px-2 rounded-[2px] transition cursor-pointer flex items-center justify-center gap-1.5 ${
              mobileStage === 'intel'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{currentAsset.symbol} Intel & Tools</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN COCKPIT VIEWPORT (Side-by-side on desktop, segmented or stacked on mobile) */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-2.5 p-2.5 min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT STAGE: LOGICALLY GROUPED MACRO CLUSTERS */}
        <div className={`${mobileStage === 'radar' ? 'flex' : 'hidden lg:flex'} w-full lg:col-span-7 flex-col min-h-0 space-y-2`}>
          
          {/* Cluster Filter Buttons */}
          <div className="flex items-center justify-between gap-1 shrink-0 overflow-x-auto pb-1 max-w-full">
            <div className="flex items-center gap-1.5 p-1 rounded-[2px] bg-slate-900/80 border border-slate-800 shrink-0">
              <button
                onClick={() => setActiveCluster('all')}
                className={`px-3 py-1 rounded-[2px] text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  activeCluster === 'all' 
                    ? 'bg-cyan-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Clusters ({watchlist.length})
              </button>
              
              {clusters.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCluster(c.id)}
                  className={`px-3 py-1 rounded-[2px] text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeCluster === c.id 
                      ? c.id === 'commodities' ? 'bg-amber-600 text-white' :
                        c.id === 'dollar_axis' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-[1px] ${
                    c.id === 'commodities' ? 'bg-amber-400' :
                    c.id === 'dollar_axis' ? 'bg-cyan-400' : 'bg-emerald-400'
                  }`} />
                  <span>{c.name}</span>
                </button>
              ))}

              {onToggleSignalsOnly && (
                <button
                  onClick={onToggleSignalsOnly}
                  className="px-2.5 sm:px-3 py-1 rounded-[2px] text-xs font-black transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-xs"
                  title="Hide all analytical text & show only 1-word hot/cold verdicts"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>⚡ Signals Only</span>
                </button>
              )}
            </div>

            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Click card to inspect macro diagnosis</span>
            </div>
          </div>

          {/* Asset Cluster Cards Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 overflow-y-auto pr-1">
            {displayedAssets.map((asset) => {
              const isSelected = asset.symbol === currentAsset.symbol;
              const isUp = asset.changePercent >= 0;
              const verdict = getAssetVerdict(asset);

              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset.symbol);
                    setRightTab('focus');
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setMobileStage('intel');
                    }
                  }}
                  className={`p-3.5 rounded-[2px] border flex flex-col justify-between transition cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? isDark 
                        ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-2 ring-cyan-500/40' 
                        : 'bg-white border-cyan-500 shadow-md ring-2 ring-cyan-500/30'
                      : isDark
                        ? 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top: Asset Symbol & Cluster Tag */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-raleway font-black text-lg lg:text-xl tracking-tight text-white group-hover:text-cyan-400 transition">
                          {asset.symbol}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* 24h Change Pill */}
                      <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs lg:text-sm flex items-center gap-1 ${
                        isUp 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isUp ? '+' : ''}{asset.changePercent}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium truncate mb-2">
                      {asset.name}
                    </div>

                    {/* BIG RALEWAY PRICE DISPLAY (Generous Size, Zero Squinting!) */}
                    <div className="font-raleway font-black text-3xl lg:text-4xl tracking-tight text-white mb-2">
                      {asset.displayPrice}
                    </div>

                    {/* 1-WORD VERDICT (HOT BUY / BULLISH 80% / HOT SELL) */}
                    <div className="my-2">
                      <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg border font-mono font-black ${verdict.badgeClasses}`}>
                        <span className="text-xs lg:text-sm tracking-wider uppercase flex items-center gap-1.5">
                          {verdict.isHot ? <Flame className="w-4 h-4 text-amber-300 animate-pulse shrink-0" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />}
                          <span>{verdict.oneWord}</span>
                        </span>
                        <span className="text-xs lg:text-sm font-black tracking-tight">
                          {verdict.shortTag}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 CORE DIAGNOSTIC SIGNALS (Whales, Institutional Buy, Volume, Technical Stance) */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    
                    {/* Signal 1: Technical Stance & RSI */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-400 text-xs font-semibold uppercase">Stance:</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs uppercase ${
                        (asset.technicalStance || '').includes('Bullish') ? 'bg-emerald-500/20 text-emerald-300' :
                        (asset.technicalStance || '').includes('Overbought') ? 'bg-amber-500/20 text-amber-300' :
                        (asset.technicalStance || '').includes('Oversold') ? 'bg-blue-500/20 text-blue-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                        {asset.technicalStance || 'Neutral'} (RSI {asset.rsi ?? 50})
                      </span>
                    </div>

                    {/* Signal 2: Institutional Positioning */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-400 text-xs font-semibold uppercase">Inst. Flow:</span>
                      <span className={`font-bold text-xs font-mono ${
                        (asset.institutionalBias || '').includes('Buy') || (asset.institutionalBias || '').includes('Accumulation')
                          ? 'text-emerald-400' 
                          : (asset.institutionalBias || '').includes('Neutral')
                            ? 'text-slate-300'
                            : 'text-rose-400'
                      }`}>
                        {asset.institutionalBias || asset.institutionalPositioning || 'Neutral'}
                      </span>
                    </div>

                    {/* Signal 3: Volume & Whale Flow */}
                    <div className="p-2 rounded bg-slate-950/70 border border-slate-800 text-xs leading-tight">
                      <div className="flex items-center justify-between text-slate-400 font-mono mb-1">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Fish className="w-3 h-3" /> Whale Order:
                        </span>
                        <span className="text-slate-200 font-semibold">{asset.volumeStatus || 'Normal Volume'}</span>
                      </div>
                      <div className="text-slate-200 font-semibold text-xs truncate">
                        {asset.whaleFlow || `${asset.whaleActivityLevel || 'Moderate'} Institutional Activity`}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Support / Resistance Quick Level */}
                  <div className="mt-2.5 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span className="font-semibold text-amber-300/90">{asset.keySupportResistance || `Range: ${asset.low24h || ''} - ${asset.high24h || ''}`}</span>
                    <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Relationship Banner: Explaining the intermarket link of the active cluster */}
          <div className="shrink-0 p-2.5 rounded-[2px] border bg-slate-900/90 border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1 rounded-[2px] bg-cyan-500/20 text-cyan-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-200">
                  {clusters.find(c => c.id === activeCluster)?.name || 'Intermarket Cluster Mechanics'}:
                </span>{' '}
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  {clusters.find(c => c.id === activeCluster)?.rationale || 
                    'Assets are grouped by causal market gravity: Commodities reflect real yields; the Dollar Axis reflects Fed/ECB rate differentials; MNQ & MES reflect equity risk appetite.'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 shrink-0 font-bold self-end sm:self-center">
              Institutional Pairs
            </span>
          </div>
        </div>

        {/* RIGHT STAGE: UNIFIED MACRO INTELLIGENCE & ACTION HUB */}
        <div className={`${mobileStage === 'intel' ? 'flex' : 'hidden lg:flex'} w-full lg:col-span-5 flex-col min-h-0 bg-slate-900/95 rounded-[2px] border border-slate-800 p-3 overflow-hidden`}>
          
          {/* Mobile Back Link (Only visible on screens < lg) */}
          <div className="lg:hidden flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
            <button 
              onClick={() => setMobileStage('radar')}
              className="text-xs text-cyan-400 font-bold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Asset Clusters</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              {currentAsset.symbol} Intel
            </span>
          </div>

          {/* Navigation Tabs for Right Panel */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 shrink-0 gap-1 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setRightTab('focus')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  rightTab === 'focus' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>{currentAsset.symbol} Focus</span>
              </button>

              <button
                onClick={() => setRightTab('calendar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  rightTab === 'calendar' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar ({calendarEvents.length})</span>
              </button>

              <button
                onClick={() => setRightTab('ai')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  rightTab === 'ai' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Macro Desk</span>
              </button>

              <button
                onClick={() => setRightTab('dictionary')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  rightTab === 'dictionary' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Macro Guide</span>
              </button>

              <button
                onClick={() => setRightTab('correlations')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  rightTab === 'correlations' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Heatmap</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden xl:inline shrink-0">
              HUD Engine
            </span>
          </div>

          {/* TAB 1: ASSET DEEP-DIVE & QUICK ALERT ARMING */}
          {rightTab === 'focus' && (() => {
            const currentVerdict = getAssetVerdict(currentAsset);
            return (
            <div className="flex-1 flex flex-col justify-between space-y-3.5 min-h-0 overflow-y-auto pr-1">
              
              {/* 1-WORD MACRO SUMMARY / CONVICTION BANNER (MUCH BIGGER FONT) */}
              <div className={`p-4 rounded-[2px] border flex items-center justify-between gap-3 ${currentVerdict.badgeClasses}`}>
                <div className="flex items-center gap-3">
                  {currentVerdict.isHot ? (
                    <Flame className="w-8 h-8 text-amber-300 animate-pulse shrink-0" />
                  ) : (
                    <Sparkles className="w-7 h-7 text-cyan-300 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-raleway font-black text-2xl sm:text-3xl tracking-wider uppercase text-white">
                        {currentVerdict.oneWord}
                      </span>
                      {currentVerdict.isHot && (
                        <span className="px-2 py-0.5 rounded-[2px] bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                          HOT SIGNAL
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold font-mono uppercase tracking-wider opacity-90 block">
                      Macro Trade Bias & Flow
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-2xl sm:text-3xl tracking-tight text-white">
                    {currentVerdict.sentimentLabel.toUpperCase()} {currentVerdict.convictionPercent}%
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-85 block">
                    Institutional Conviction
                  </span>
                </div>
              </div>

              {/* Asset Header Banner */}
              <div className="p-4 rounded-[2px] bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-raleway font-black text-xl sm:text-2xl text-cyan-400 tracking-tight block truncate">
                      {currentAsset.symbol} — {currentAsset.name}
                    </span>
                    <div className="text-xs text-slate-300 font-semibold truncate mt-0.5">
                      {currentAsset.clusterPairDescription || currentAsset.clusterName}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-raleway font-black text-2xl sm:text-3xl text-white">
                      {currentAsset.displayPrice}
                    </div>
                    <span className={`text-sm font-mono font-bold ${
                      currentAsset.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {currentAsset.changePercent >= 0 ? '+' : ''}{currentAsset.changePercent}%
                    </span>
                  </div>
                </div>

                {/* Primary Driver & Why It's Moving */}
                <div className="pt-2.5 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                      Primary Driver: {(currentAsset.primaryDriver || 'Macro').toUpperCase()}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {currentAsset.volumeStatus || 'Standard Volume'}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed text-sm font-medium">
                    {currentAsset.whyItsMoving || 'Institutional limit orderflow active.'}
                  </p>
                </div>
              </div>

              {/* Intermarket Correlation & Key Support/Resistance */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-[2px] bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
                    Intermarket Partner Link:
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-normal">
                    {currentAsset.intermarketCorrelation || 'Correlated with global macro asset basket.'}
                  </p>
                </div>

                <div className="p-3 rounded-[2px] bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold block">
                    Institutional Levels:
                  </span>
                  <div className="font-mono text-sm font-bold text-amber-300">
                    {currentAsset.keySupportResistance || `Range: ${currentAsset.low24h || ''} - ${currentAsset.high24h || ''}`}
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">
                    Whale Flow: {currentAsset.whaleFlow || `${currentAsset.whaleActivityLevel || 'Moderate'} flow`}
                  </div>
                </div>
              </div>

              {/* Quick Arm Alert Form right inside the screen */}
              <div className="p-3 rounded-[2px] bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Arm Quick Price Watcher for {currentAsset.symbol}</span>
                  </span>
                  {alertSuccessMsg && (
                    <span className="text-[11px] text-emerald-400 font-mono font-bold animate-pulse">
                      {alertSuccessMsg}
                    </span>
                  )}
                </div>

                <form onSubmit={handleCreateQuickAlert} className="flex gap-2">
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                    className="px-2 py-1.5 rounded-[2px] bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                  >
                    <option value="above">Crosses Above</option>
                    <option value="below">Crosses Below</option>
                  </select>

                  <input
                    type="number"
                    step="any"
                    placeholder={`e.g. ${currentAsset.price}`}
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-[2px] bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500"
                  />

                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-[2px] bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer transition"
                  >
                    Arm Watcher
                  </button>
                </form>

                {/* Active watchers for this symbol */}
                <div className="flex flex-wrap gap-1 pt-1 text-[10px] font-mono">
                  {alerts.filter(a => a.symbol === currentAsset.symbol).map(a => (
                    <span key={a.id} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {a.condition} {a.targetPrice} ({a.active ? 'ACTIVE' : 'TRIGGERED'})
                    </span>
                  ))}
                  {alerts.filter(a => a.symbol === currentAsset.symbol).length === 0 && (
                    <span className="text-slate-500">No active watchers for {currentAsset.symbol}</span>
                  )}
                </div>
              </div>
            </div>
            );
          })()}

          {/* TAB 2: LIVE ECONOMIC CALENDAR */}
          {rightTab === 'calendar' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-2 overflow-y-auto pr-1">
              <div className="text-xs text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800">
                <span>Today's Catalysts (Cause & Price Reaction)</span>
                <span className="font-mono text-[10px] text-cyan-400">High & Medium Impact</span>
              </div>

              <div className="space-y-2">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{evt.flag}</span>
                        <span className="text-cyan-400">{evt.currency}</span>
                        <span className="text-slate-200">{evt.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">{evt.time}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 border-t border-slate-900">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Actual:</span>
                        <span className="font-bold text-white">{evt.actual || 'Upcoming'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Forecast:</span>
                        <span className="text-slate-300">{evt.forecast}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Previous:</span>
                        <span className="text-slate-400">{evt.previous}</span>
                      </div>
                    </div>

                    {/* Instant Reaction note */}
                    <div className="text-[10px] text-amber-300/90 font-medium pt-1">
                      → Reacts on {evt.reaction.affectedAsset}: {evt.reaction.driverExplanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI MACRO DESK & SCENARIO SIMULATOR */}
          {rightTab === 'ai' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto pr-1">
              <div className="p-3 rounded-[2px] bg-gradient-to-r from-blue-950/40 via-slate-950 to-cyan-950/40 border border-cyan-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Macro Desk Briefing
                  </span>
                  <span className="px-1.5 py-0.2 rounded-[2px] text-[9px] font-mono bg-amber-500/20 text-amber-300">
                    LIVE SYNTHESIS
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  <strong>Current Macro Regime:</strong> 10Y US Treasury yields held at 4.28% (+7bps). 
                  Central banks continuing aggressive physical gold accumulation at $2,830. 
                  MNQ Tech momentum remains resilient despite elevated real rate discounting.
                </p>
              </div>

              {/* Quick AI Scenario Simulator */}
              <div className="p-3 rounded-[2px] bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Macro "What If" Simulator
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Instant Volatility Projection</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiScenarioText}
                    onChange={(e) => setAiScenarioText(e.target.value)}
                    placeholder="Enter scenario e.g. Core CPI beats forecast"
                    className="flex-1 px-2.5 py-1.5 rounded-[2px] bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                  <button
                    onClick={handleSimulateScenario}
                    disabled={isSimulatingAi}
                    className="px-3 py-1.5 rounded-[2px] bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer transition disabled:opacity-50"
                  >
                    {isSimulatingAi ? 'Simulating...' : 'Simulate'}
                  </button>
                </div>

                {/* Fast Scenario presets */}
                <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                  {[
                    'Core CPI beats (+0.4% m/m)',
                    'EIA Crude builds +6M bbls',
                    'NFP misses sharply at 85k',
                    'Fed hints at rate pause'
                  ].map(p => (
                    <button
                      key={p}
                      onClick={() => setAiScenarioText(p)}
                      className="px-2 py-0.5 rounded-[2px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Result */}
                {aiScenarioResult && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5 pt-2">
                    <div className="font-bold text-amber-300 text-[11px]">
                      Projected Reaction: {aiScenarioText}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                        <span className="font-bold text-cyan-400 block">USD:</span>
                        <span className="text-slate-300">{aiScenarioResult.howItMovesTheMarket?.usd}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                        <span className="font-bold text-amber-400 block">Gold:</span>
                        <span className="text-slate-300">{aiScenarioResult.howItMovesTheMarket?.gold}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                        <span className="font-bold text-emerald-400 block">Oil:</span>
                        <span className="text-slate-300">{aiScenarioResult.howItMovesTheMarket?.oil}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MACRO DICTIONARY & BREAKING NEWS */}
          {rightTab === 'dictionary' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-y-auto pr-1">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-cyan-400 block">
                  Core Economic Indicators (Plain English)
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  High-yield cheat sheet for trading major news catalysts.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-400 mb-0.5">1. GDP (Gross Domestic Product)</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Total value of all goods and services. A strong GDP print means a thriving economy, lifting the domestic currency and yields, but often punishing gold unless accompanied by out-of-control inflation.
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-0.5">2. Non-Farm Payrolls (Jobs / NFP)</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Number of jobs added outside the farm sector. Released the first Friday of each month. Beats cause instant US Dollar rallies and stock volatility; misses trigger rapid safe-haven bids into gold and Treasuries.
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-cyan-400 mb-0.5">3. CPI / Inflation (Core CPI)</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Measures consumer price changes excluding volatile food and energy. High CPI forces the Federal Reserve to keep interest rates higher for longer, boosting the US Dollar and putting downward pressure on equities.
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-rose-400 mb-0.5">4. EIA Crude Oil Inventories</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Weekly storage report every Wednesday at 10:30 AM EST. An inventory build means excess supply (bearish oil); a draw means surging demand or tight supply (bullish oil, lifts CAD).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INTERMARKET CORRELATION MATRIX */}
          {rightTab === 'correlations' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1">
              <CorrelationHeatmap isDark={isDark} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
