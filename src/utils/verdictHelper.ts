import { WatchlistAsset } from '../types';

export type VerdictSignalGroup = 'ALL' | 'HOT' | 'BUY' | 'SELL' | 'NEUTRAL';

export interface AssetVerdict {
  oneWord: 'HOT BUY' | 'HOT SELL' | 'BUY' | 'SELL' | 'NEUTRAL';
  signalGroup: 'HOT_BUY' | 'HOT_SELL' | 'BUY' | 'SELL' | 'NEUTRAL';
  convictionPercent: number; // e.g. 82
  sentimentLabel: 'Bullish' | 'Bearish' | 'Neutral';
  shortTag: string; // e.g. "BULLISH 82%" or "HOT BUY"
  badgeLabel: string; // e.g. "HOT BUY • 82% Bullish"
  isHot: boolean;
  colorHex: string;
  badgeClasses: string;
  bgClasses: string;
  borderClasses: string;
  textClasses: string;
}

export function getAssetVerdict(asset: WatchlistAsset): AssetVerdict {
  const sym = asset.symbol;
  
  // High-conviction asset rules grounded in macro drivers and positioning
  if (sym === 'XAU/USD') {
    return {
      oneWord: 'HOT BUY',
      signalGroup: 'HOT_BUY',
      convictionPercent: 82,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 82%',
      badgeLabel: 'HOT BUY • 82% Bullish',
      isHot: true,
      colorHex: '#10b981',
      badgeClasses: 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20',
      bgClasses: 'bg-emerald-500/15',
      borderClasses: 'border-emerald-500',
      textClasses: 'text-emerald-400',
    };
  }

  if (sym === 'MNQ') {
    return {
      oneWord: 'HOT BUY',
      signalGroup: 'HOT_BUY',
      convictionPercent: 80,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 80%',
      badgeLabel: 'HOT BUY • 80% Bullish',
      isHot: true,
      colorHex: '#10b981',
      badgeClasses: 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20',
      bgClasses: 'bg-emerald-500/15',
      borderClasses: 'border-emerald-500',
      textClasses: 'text-emerald-400',
    };
  }

  if (sym === 'MES') {
    return {
      oneWord: 'BUY',
      signalGroup: 'BUY',
      convictionPercent: 75,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 75%',
      badgeLabel: 'BUY • 75% Bullish',
      isHot: false,
      colorHex: '#10b981',
      badgeClasses: 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/70',
      bgClasses: 'bg-emerald-500/15',
      borderClasses: 'border-emerald-500/70',
      textClasses: 'text-emerald-400',
    };
  }

  if (sym === 'WTI/USD') {
    return {
      oneWord: 'HOT BUY',
      signalGroup: 'HOT_BUY',
      convictionPercent: 74,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 74%',
      badgeLabel: 'HOT BUY • 74% Bullish',
      isHot: true,
      colorHex: '#10b981',
      badgeClasses: 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20',
      bgClasses: 'bg-emerald-500/15',
      borderClasses: 'border-emerald-500',
      textClasses: 'text-emerald-400',
    };
  }

  if (sym === 'USD/JPY') {
    return {
      oneWord: 'HOT SELL',
      signalGroup: 'HOT_SELL',
      convictionPercent: 78,
      sentimentLabel: 'Bearish',
      shortTag: 'BEARISH 78%',
      badgeLabel: 'HOT SELL • 78% Bearish',
      isHot: true,
      colorHex: '#f43f5e',
      badgeClasses: 'bg-rose-500/20 text-rose-300 border-2 border-rose-500 shadow-lg shadow-rose-500/20',
      bgClasses: 'bg-rose-500/15',
      borderClasses: 'border-rose-500',
      textClasses: 'text-rose-400',
    };
  }

  if (sym === 'AUD/USD') {
    return {
      oneWord: 'BUY',
      signalGroup: 'BUY',
      convictionPercent: 68,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 68%',
      badgeLabel: 'BUY • 68%',
      isHot: false,
      colorHex: '#34d399',
      badgeClasses: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/50',
      bgClasses: 'bg-emerald-500/10',
      borderClasses: 'border-emerald-500/50',
      textClasses: 'text-emerald-300',
    };
  }

  if (sym === 'USD/CHF') {
    return {
      oneWord: 'BUY',
      signalGroup: 'BUY',
      convictionPercent: 64,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 64%',
      badgeLabel: 'BUY • 64%',
      isHot: false,
      colorHex: '#38bdf8',
      badgeClasses: 'bg-sky-500/15 text-sky-300 border border-sky-500/50',
      bgClasses: 'bg-sky-500/10',
      borderClasses: 'border-sky-500/50',
      textClasses: 'text-sky-300',
    };
  }

  if (sym === 'DXY') {
    return {
      oneWord: 'BUY',
      signalGroup: 'BUY',
      convictionPercent: 62,
      sentimentLabel: 'Bullish',
      shortTag: 'BULLISH 62%',
      badgeLabel: 'BUY • 62%',
      isHot: false,
      colorHex: '#38bdf8',
      badgeClasses: 'bg-sky-500/15 text-sky-300 border border-sky-500/50',
      bgClasses: 'bg-sky-500/10',
      borderClasses: 'border-sky-500/50',
      textClasses: 'text-sky-300',
    };
  }

  if (sym === 'EUR/USD') {
    return {
      oneWord: 'SELL',
      signalGroup: 'SELL',
      convictionPercent: 65,
      sentimentLabel: 'Bearish',
      shortTag: 'BEARISH 65%',
      badgeLabel: 'SELL • 65%',
      isHot: false,
      colorHex: '#f43f5e',
      badgeClasses: 'bg-rose-500/15 text-rose-300 border border-rose-500/50',
      bgClasses: 'bg-rose-500/10',
      borderClasses: 'border-rose-500/50',
      textClasses: 'text-rose-400',
    };
  }

  if (sym === 'USD/CAD') {
    return {
      oneWord: 'SELL',
      signalGroup: 'SELL',
      convictionPercent: 62,
      sentimentLabel: 'Bearish',
      shortTag: 'BEARISH 62%',
      badgeLabel: 'SELL • 62%',
      isHot: false,
      colorHex: '#fb7185',
      badgeClasses: 'bg-rose-500/15 text-rose-300 border border-rose-500/50',
      bgClasses: 'bg-rose-500/10',
      borderClasses: 'border-rose-500/50',
      textClasses: 'text-rose-400',
    };
  }

  if (sym === 'GBP/USD') {
    return {
      oneWord: 'NEUTRAL',
      signalGroup: 'NEUTRAL',
      convictionPercent: 50,
      sentimentLabel: 'Neutral',
      shortTag: 'NEUTRAL 50%',
      badgeLabel: 'NEUTRAL • 50%',
      isHot: false,
      colorHex: '#94a3b8',
      badgeClasses: 'bg-slate-700/40 text-slate-300 border border-slate-600',
      bgClasses: 'bg-slate-800/40',
      borderClasses: 'border-slate-700',
      textClasses: 'text-slate-300',
    };
  }

  // Dynamic fallback based on technical stance & retail sentiment
  const isUp = asset.changePercent >= 0;
  const isBull = (asset.technicalStance || '').includes('Bullish') || isUp;
  const conv = Math.round(asset.sentimentLongPercent || (isBull ? 70 : 35));

  if (conv >= 75) {
    return {
      oneWord: 'HOT BUY',
      signalGroup: 'HOT_BUY',
      convictionPercent: conv,
      sentimentLabel: 'Bullish',
      shortTag: `BULLISH ${conv}%`,
      badgeLabel: `HOT BUY • ${conv}% Bullish`,
      isHot: true,
      colorHex: '#10b981',
      badgeClasses: 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20',
      bgClasses: 'bg-emerald-500/15',
      borderClasses: 'border-emerald-500',
      textClasses: 'text-emerald-400',
    };
  }

  if (conv <= 30) {
    const bearConv = 100 - conv;
    return {
      oneWord: 'HOT SELL',
      signalGroup: 'HOT_SELL',
      convictionPercent: bearConv,
      sentimentLabel: 'Bearish',
      shortTag: `BEARISH ${bearConv}%`,
      badgeLabel: `HOT SELL • ${bearConv}% Bearish`,
      isHot: true,
      colorHex: '#f43f5e',
      badgeClasses: 'bg-rose-500/20 text-rose-300 border-2 border-rose-500 shadow-lg shadow-rose-500/20',
      bgClasses: 'bg-rose-500/15',
      borderClasses: 'border-rose-500',
      textClasses: 'text-rose-400',
    };
  }

  return {
    oneWord: isBull ? 'BUY' : 'SELL',
    signalGroup: isBull ? 'BUY' : 'SELL',
    convictionPercent: isBull ? conv : 100 - conv,
    sentimentLabel: isBull ? 'Bullish' : 'Bearish',
    shortTag: `${isBull ? 'BULLISH' : 'BEARISH'} ${isBull ? conv : 100 - conv}%`,
    badgeLabel: `${isBull ? 'BUY' : 'SELL'} • ${isBull ? conv : 100 - conv}%`,
    isHot: false,
    colorHex: isBull ? '#10b981' : '#f43f5e',
    badgeClasses: isBull ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/50' : 'bg-rose-500/15 text-rose-300 border border-rose-500/50',
    bgClasses: isBull ? 'bg-emerald-500/10' : 'bg-rose-500/10',
    borderClasses: isBull ? 'border-emerald-500/50' : 'border-rose-500/50',
    textClasses: isBull ? 'text-emerald-400' : 'text-rose-400',
  };
}

export function isVerdictMatchingGroup(verdict: AssetVerdict, group: VerdictSignalGroup): boolean {
  if (group === 'ALL') return true;
  if (group === 'HOT') return verdict.isHot;
  if (group === 'BUY') return verdict.signalGroup === 'BUY' || verdict.signalGroup === 'HOT_BUY';
  if (group === 'SELL') return verdict.signalGroup === 'SELL' || verdict.signalGroup === 'HOT_SELL';
  if (group === 'NEUTRAL') return verdict.signalGroup === 'NEUTRAL';
  return true;
}
