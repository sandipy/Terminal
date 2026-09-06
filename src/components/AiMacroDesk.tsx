import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Target, 
  Compass, 
  Flame, 
  BarChart3, 
  Building2, 
  Fish, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { WatchlistAsset, AiMarketAnalysis, DriverType } from '../types';

interface AiMacroDeskProps {
  watchlist: WatchlistAsset[];
  isDark: boolean;
  selectedAssetSymbol: string;
  onSelectAsset: (symbol: string) => void;
}

interface LivePulseData {
  pulseHeadline: string;
  sentiment: string;
  yieldEnvironment: string;
  commoditiesTake: string;
  keyRecommendation: string;
}

export const AiMacroDesk: React.FC<AiMacroDeskProps> = ({
  watchlist,
  isDark,
  selectedAssetSymbol,
  onSelectAsset,
}) => {
  const [pulseData, setPulseData] = useState<LivePulseData | null>(null);
  const [isPulseLoading, setIsPulseLoading] = useState(false);

  // Deep Analyzer State
  const [analysisAsset, setAnalysisAsset] = useState(selectedAssetSymbol || 'XAU/USD');
  const [analysisResult, setAnalysisResult] = useState<AiMarketAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Scenario Simulator State
  const [scenarioInput, setScenarioInput] = useState('Core CPI comes in at 0.4% (hotter than forecast)');
  const [scenarioOutput, setScenarioOutput] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Fetch Live Pulse on Mount
  useEffect(() => {
    fetchLivePulse();
  }, []);

  const fetchLivePulse = async () => {
    setIsPulseLoading(true);
    try {
      const res = await fetch('/api/ai/live-pulse');
      if (res.ok) {
        const data = await res.json();
        setPulseData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPulseLoading(false);
    }
  };

  const handleRunAiAnalysis = async (symbolToAnalyze?: string) => {
    const symbol = symbolToAnalyze || analysisAsset;
    const asset = watchlist.find(a => a.symbol === symbol);
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/analyze-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetOrEvent: symbol,
          currentPrice: asset?.displayPrice,
          currentDriver: asset?.primaryDriver,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSimulateScenario = async () => {
    if (!scenarioInput.trim()) return;
    setIsSimulating(true);

    try {
      const res = await fetch('/api/ai/explain-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: `Macro Scenario: ${scenarioInput}` }),
      });

      if (res.ok) {
        const data = await res.json();
        setScenarioOutput(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const sampleScenarios = [
    'US Core CPI beats forecast (+0.4% m/m)',
    'EIA Crude builds by +6M barrels',
    'NFP misses sharply at 85k jobs',
    'Fed hints at pausing balance sheet QT',
  ];

  return (
    <div id="ai-macro-desk-section" className="space-y-4">
      
      {/* 1. Live AI Pulse Flash Briefing Banner */}
      <div className={`p-4 rounded-xl border transition ${
        isDark 
          ? 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 border-cyan-500/30' 
          : 'bg-gradient-to-r from-blue-50 via-white to-cyan-50 border-cyan-200 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI Institutional Desk Pulse</h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Automated synthesis of live yield spreads, bullion absorption, and energy supplies
              </p>
            </div>
          </div>

          <button
            onClick={fetchLivePulse}
            disabled={isPulseLoading}
            className={`text-xs px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1 transition cursor-pointer ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isPulseLoading ? 'animate-spin' : ''}`} />
            <span>{isPulseLoading ? 'Refreshing...' : 'Refresh AI Pulse'}</span>
          </button>
        </div>

        {pulseData && (
          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-sm text-cyan-400">{pulseData.pulseHeadline}</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pulseData.sentiment}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Yields & Dollar:</span>
                <span className="text-slate-200">{pulseData.yieldEnvironment}</span>
              </div>
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Commodities (Gold/Oil):</span>
                <span className="text-slate-200">{pulseData.commoditiesTake}</span>
              </div>
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="font-bold text-slate-400 block text-[10px] uppercase">Key Desk Tip:</span>
                <span className="text-cyan-300 font-medium">{pulseData.keyRecommendation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Deep Market AI Analyzer & Scenario Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: AI Deep Asset Analysis */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold">Deep Asset Driver Analysis</h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Orderflow & Macro Deep Dive</span>
          </div>

          <div className="flex gap-2">
            <select
              value={analysisAsset}
              onChange={(e) => {
                setAnalysisAsset(e.target.value);
                onSelectAsset(e.target.value);
              }}
              className={`flex-1 px-3 py-1.5 text-xs rounded-lg border font-mono ${
                isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {watchlist.map(a => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} — {a.name} ({a.displayPrice})
                </option>
              ))}
            </select>

            <button
              onClick={() => handleRunAiAnalysis()}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Asset</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Result Card */}
          {analysisResult ? (
            <div className={`p-3 rounded-lg border text-xs space-y-2.5 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm text-cyan-400">{analysisResult.assetOrEvent}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                    analysisResult.bias === 'Bullish' ? 'bg-emerald-500/20 text-emerald-300' :
                    analysisResult.bias === 'Bearish' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {analysisResult.bias} Bias
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: {analysisResult.confidenceScore}%
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {analysisResult.currentContext}
              </p>

              {/* Support / Resistance */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="opacity-75 block text-[10px]">Key Support:</span>
                  <span className="font-bold">{analysisResult.supportResistance.support}</span>
                </div>
                <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <span className="opacity-75 block text-[10px]">Overhead Resistance:</span>
                  <span className="font-bold">{analysisResult.supportResistance.resistance}</span>
                </div>
              </div>

              {/* Key Drivers */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Macro & Flow Drivers:
                </span>
                <ul className="space-y-1">
                  {analysisResult.keyDrivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                      <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                <span className="font-bold text-amber-400">Execution Plan: </span>
                <span>{analysisResult.traderRecommendation}</span>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-lg border text-center text-xs font-mono ${
              isDark ? 'bg-slate-950/40 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              Click "Analyze Asset" above to run deep institutional Gemini reasoning on {analysisAsset}.
            </div>
          )}
        </div>

        {/* Right: AI Macro Scenario Simulator */}
        <div className={`p-4 rounded-xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold">AI Release Scenario Simulator</h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">"What If?" Projection</span>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSimulateScenario();
                }}
                placeholder="Describe a macro release scenario..."
                className={`flex-1 px-3 py-1.5 text-xs rounded-lg border font-mono ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={handleSimulateScenario}
                disabled={isSimulating || !scenarioInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Projecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Scenario Buttons */}
            <div className="flex flex-wrap gap-1 text-[10px] font-mono">
              {sampleScenarios.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScenarioInput(s);
                  }}
                  className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                    isDark ? 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Output */}
          {scenarioOutput ? (
            <div className={`p-3 rounded-lg border text-xs space-y-2.5 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-amber-400 border-b pb-1 border-slate-800">
                Simulated Impact: {scenarioInput}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-emerald-400 block mb-0.5">USD Reaction:</span>
                  <span className="text-slate-300 leading-tight">{scenarioOutput.howItMovesTheMarket?.usd}</span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-amber-400 block mb-0.5">Gold Reaction:</span>
                  <span className="text-slate-300 leading-tight">{scenarioOutput.howItMovesTheMarket?.gold}</span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-orange-400 block mb-0.5">Oil Reaction:</span>
                  <span className="text-slate-300 leading-tight">{scenarioOutput.howItMovesTheMarket?.oil}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 pt-1">
                <span className="font-bold text-cyan-400">Trigger Threshold: </span>
                <span>{scenarioOutput.keyTriggerThresholds}</span>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-lg border text-center text-xs font-mono ${
              isDark ? 'bg-slate-950/40 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              Test what happens when macro releases deviate by selecting a scenario above and clicking "Simulate".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
