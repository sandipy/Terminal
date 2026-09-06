import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Flame, 
  Briefcase, 
  BarChart2, 
  HelpCircle,
  Lightbulb,
  Cpu,
  Layers,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { EconomicTerm, RealNewsItem, AiTermExplanation } from '../types';
import { ECONOMIC_DICTIONARY_TERMS } from '../data/economicData';

interface EconomicDictionaryProps {
  isDark: boolean;
  newsItems: RealNewsItem[];
  onSyncNews: () => void;
  isSyncing: boolean;
}

export const EconomicDictionary: React.FC<EconomicDictionaryProps> = ({
  isDark,
  newsItems,
  onSyncNews,
  isSyncing,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // AI Term Explorer state
  const [aiInputTerm, setAiInputTerm] = useState<string>('Consumer Price Index (CPI)');
  const [aiResult, setAiResult] = useState<AiTermExplanation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Terms' },
    { id: 'growth', label: 'GDP & Growth' },
    { id: 'inflation', label: 'CPI & Inflation' },
    { id: 'employment', label: 'Jobs & Labor' },
    { id: 'central_banks', label: 'Interest Rates' },
    { id: 'commodities', label: 'Oil & Energy' },
    { id: 'liquidity', label: 'Whale & Orderflow' },
  ];

  const filteredTerms = ECONOMIC_DICTIONARY_TERMS.filter((term) => {
    const matchesCategory = activeCategory === 'all' || term.category === activeCategory;
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return matchesCategory;

    const titleMatch = (term.title || '').toLowerCase().includes(query);
    const acronymMatch = term.acronym ? term.acronym.toLowerCase().includes(query) : false;
    const defMatch = (term.quickDefinition || '').toLowerCase().includes(query);
    const takeawayMatch = (term.traderTakeaway || '').toLowerCase().includes(query);

    return matchesCategory && (titleMatch || acronymMatch || defMatch || takeawayMatch);
  });

  const handleAskAi = async (termToAsk?: string) => {
    const query = termToAsk || aiInputTerm;
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/explain-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI explanation');
      }

      const data: AiTermExplanation = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError('Unable to connect to AI engine. Using local dictionary data.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const sampleAiSuggestions = [
    'GDP vs GNP',
    'Core CPI vs Headline CPI',
    'Non-Farm Payrolls (NFP)',
    'Yield Curve Inversion',
    'Stagflation',
    'Quantitative Tightening (QT)',
    'EIA Crude Inventory Draw',
  ];

  return (
    <div id="economic-dictionary-section" className="space-y-6">
      
      {/* 1. Header & Live News Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h2 className="text-base font-bold tracking-tight">
            Economic Dictionary & Real-Time Macro News
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded font-mono ${
            isDark ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
          }`}>
            GDP • Jobs • Inflation • Commodities
          </span>
        </div>

        {/* Sync Button */}
        <button
          id="btn-sync-news"
          onClick={onSyncNews}
          disabled={isSyncing}
          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            isSyncing 
              ? 'opacity-70 cursor-not-allowed' 
              : isDark 
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Live News'}</span>
        </button>
      </div>

      {/* 2. Interactive AI Economic Intelligence Prompt (Gemini Powered) */}
      <div 
        id="ai-term-explainer-card"
        className={`p-4 sm:p-5 rounded-xl border transition ${
          isDark 
            ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30 border-cyan-500/30 shadow-lg' 
            : 'bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/50 border-cyan-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI Economic Term & Impact Explainer</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Ask Gemini to decode how any macro report or financial term moves USD, Gold, and Oil.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
            Gemini 3.8 Flash
          </span>
        </div>

        {/* Input bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={aiInputTerm}
              onChange={(e) => setAiInputTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskAi();
              }}
              placeholder="e.g. GDP, Core PCE, Jobs NFP, Yield Curve Inversion, OPEC+..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border font-mono ${
                isDark ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <button
            id="btn-ask-gemini-term"
            onClick={() => handleAskAi()}
            disabled={isAiLoading || !aiInputTerm.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-cyan-600/20 disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Term...</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5" />
                <span>Explain Term with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try quick terms:
          </span>
          {sampleAiSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setAiInputTerm(suggestion);
                handleAskAi(suggestion);
              }}
              className={`px-2 py-0.5 rounded-md border text-[11px] font-mono transition cursor-pointer ${
                isDark 
                  ? 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300' 
                  : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-800'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* AI Output Display Box */}
        {aiResult && (
          <div className={`mt-4 p-3.5 sm:p-4 rounded-xl border ${
            isDark ? 'bg-slate-900/90 border-cyan-500/40' : 'bg-white border-cyan-200 shadow-sm'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 mb-3 border-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-cyan-400">{aiResult.term}</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  AI Analyzed
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Trigger Threshold: {aiResult.keyTriggerThresholds}
              </span>
            </div>

            <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {aiResult.simpleExplanation}
            </p>

            {/* Tri-Asset Impact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
              <div className={`p-2.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1 font-bold text-emerald-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>US Dollar Impact</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {aiResult.howItMovesTheMarket?.usd}
                </p>
              </div>

              <div className={`p-2.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1 font-bold text-amber-400 mb-1">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Gold (XAU) Impact</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {aiResult.howItMovesTheMarket?.gold}
                </p>
              </div>

              <div className={`p-2.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1 font-bold text-orange-400 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Crude Oil (WTI) Impact</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {aiResult.howItMovesTheMarket?.oil}
                </p>
              </div>
            </div>

            {/* Pro-Tip Box */}
            <div className={`p-2.5 rounded-lg border flex items-start gap-2 text-xs ${
              isDark ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-200' : 'bg-cyan-50 border-cyan-200 text-cyan-900'
            }`}>
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pro Trader Rule: </span>
                <span>{aiResult.proTipForTraders}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Real-Time Macro News Stream Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight">Live Macro News & Market Releases</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold">
              Live Wire
            </span>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time macroeconomic catalysts moving forex & commodity prices
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {newsItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition ${
                isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono mb-1.5">
                  <span className={`px-2 py-0.2 rounded font-bold uppercase ${
                    item.impact === 'high'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.impact} Impact
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{item.timeAgo}</span>
                </div>
                <h4 className="text-xs font-bold leading-snug tracking-tight mb-1.5">
                  {item.headline}
                </h4>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <span className="text-slate-500">Pairs:</span>
                  {item.affectedAssets.map(asset => (
                    <span key={asset} className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-bold">
                      {asset}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setAiInputTerm(item.headline);
                    handleAskAi(item.headline);
                  }}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Breakdown
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Terms Explained Matrix (GDP, Jobs, Inflation, etc.) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight">Macroeconomic Terms Reference</h3>
            <span className="text-xs font-mono text-slate-400">
              ({filteredTerms.length} Definitions)
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  activeCategory === cat.id
                    ? isDark 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' 
                      : 'bg-cyan-50 text-cyan-800 border-cyan-300 font-bold'
                    : isDark 
                      ? 'border-slate-800 text-slate-400 hover:text-slate-200' 
                      : 'border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              id={`dict-${term.id}`}
              className={`p-4 rounded-xl border space-y-3 transition ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold tracking-tight">{term.title}</h4>
                    {term.acronym && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold">
                        {term.acronym}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {term.frequency} • {term.importance}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setAiInputTerm(term.title);
                    handleAskAi(term.title);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 font-mono transition cursor-pointer ${
                    isDark 
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20' 
                      : 'border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
                  }`}
                  title="Ask Gemini for deep technical analysis"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Ask AI</span>
                </button>
              </div>

              {/* Definition */}
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {term.quickDefinition}
              </p>

              {/* Core Rule / Formula */}
              <div className={`p-2 rounded-lg border font-mono text-[11px] ${
                isDark ? 'bg-slate-950/60 border-slate-800/80 text-amber-300' : 'bg-slate-50 border-slate-200 text-amber-800'
              }`}>
                <span className="font-bold opacity-75">Formula / Rule: </span>
                <span>{term.keyRuleOrFormula}</span>
              </div>

              {/* Asset Impact 3-way breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className={`p-2 rounded border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-emerald-400 block mb-0.5">USD Effect:</span>
                  <span className="text-slate-300 leading-tight">{term.impactOnAssets.usd}</span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-amber-400 block mb-0.5">Gold Effect:</span>
                  <span className="text-slate-300 leading-tight">{term.impactOnAssets.gold}</span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <span className="font-bold text-orange-400 block mb-0.5">Oil Effect:</span>
                  <span className="text-slate-300 leading-tight">{term.impactOnAssets.oil}</span>
                </div>
              </div>

              {/* Trader Takeaway */}
              <div className="text-[11px] pt-1 text-slate-400 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">Trader Takeaway:</strong> {term.traderTakeaway}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
