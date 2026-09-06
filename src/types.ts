export type ImpactLevel = 'high' | 'medium' | 'low';

export type DriverType = 'whale' | 'institutional' | 'macro' | 'noise';

export interface MarketReaction {
  affectedAsset: string;
  reactionDirection: 'bullish' | 'bearish' | 'mixed';
  impactPipsOrPoints: string;
  driverType: DriverType;
  driverExplanation: string;
  historicalCorrelation: string;
}

export interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  timestamp: number;
  currency: string;
  country: string;
  flag: string;
  impact: ImpactLevel;
  title: string;
  actual: string | null;
  forecast: string;
  previous: string;
  status: 'released' | 'upcoming';
  deviation?: 'beat' | 'miss' | 'inline' | 'pending';
  surpriseDetail?: string;
  reaction: MarketReaction;
  alertSubscribed?: boolean;
}

export type AssetCluster = 'commodities' | 'dollar_axis' | 'indices';

export interface WatchlistAsset {
  symbol: string;
  name: string;
  category: 'forex' | 'commodity' | 'indices' | 'dollar';
  clusterId: AssetCluster;
  clusterName: string;
  clusterPairDescription?: string;
  price: number;
  displayPrice: string;
  change24h: number;
  changePercent: number;
  pipChange: number;
  high24h: string;
  low24h: string;
  sparkline: number[];
  sentimentLongPercent: number;
  sentimentShortPercent: number;
  primaryDriver: DriverType;
  whyItsMoving: string;
  whaleActivityLevel: 'High' | 'Moderate' | 'Low';
  whaleFlow: string;
  volumeStatus: string;
  institutionalPositioning: 'Heavy Long' | 'Neutral' | 'Net Short';
  institutionalBias: 'Institutional Buy' | 'Institutional Accumulation' | 'Institutional Neutral' | 'Institutional Distribution' | 'Institutional Sell';
  technicalStance: 'Bullish Expansion' | 'Overbought' | 'Neutral Consolidation' | 'Oversold Pullback' | 'Bearish Breakdown';
  rsi: number;
  keySupportResistance: string;
  newsCorrelation: string;
  intermarketCorrelation: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  createdPrice: number;
  createdAt: string;
  active: boolean;
  triggered: boolean;
  triggeredAt?: string;
}

export interface HistoricalImpactStat {
  eventType: string;
  currency: string;
  frequency: string;
  avgVolatilityPips: number;
  maxVolatilityPips: number;
  goldReactionAvg: string;
  oilReactionAvg: string;
  primaryMarketDriver: DriverType;
  whyThisMatters: string;
  lastReactionSummary: string;
}

export interface MarketDriverGuide {
  type: DriverType;
  title: string;
  badgeColor: string;
  iconName: string;
  description: string;
  howToIdentify: string[];
  reliabilityScore: string;
  typicalDuration: string;
}

export interface EconomicTerm {
  id: string;
  title: string;
  acronym?: string;
  category: 'growth' | 'inflation' | 'employment' | 'central_banks' | 'commodities' | 'liquidity';
  quickDefinition: string;
  importance: 'Tier 1 (High Impact)' | 'Tier 2 (Medium Impact)';
  frequency: string;
  keyRuleOrFormula: string;
  impactOnAssets: {
    usd: string;
    gold: string;
    oil: string;
  };
  traderTakeaway: string;
}

export interface RealNewsItem {
  id: string;
  timestamp: number;
  timeAgo: string;
  headline: string;
  summary: string;
  source: string;
  category: 'macro' | 'central_bank' | 'commodity' | 'forex';
  impact: ImpactLevel;
  affectedAssets: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  url?: string;
}

export interface AiMarketAnalysis {
  assetOrEvent: string;
  currentContext: string;
  primaryDriver: DriverType;
  bias: 'Bullish' | 'Bearish' | 'Neutral' | 'Volatile';
  confidenceScore: number;
  keyDrivers: string[];
  supportResistance: {
    support: string;
    resistance: string;
  };
  macroRiskFactors: string[];
  traderRecommendation: string;
}

export interface AiTermExplanation {
  term: string;
  simpleExplanation: string;
  howItMovesTheMarket: {
    usd: string;
    gold: string;
    oil: string;
  };
  keyTriggerThresholds: string;
  proTipForTraders: string;
}

export interface OnScreenAlertNotice {
  id: string;
  type: 'price' | 'news' | 'macro_warning';
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'info';
  assetSymbol?: string;
}
