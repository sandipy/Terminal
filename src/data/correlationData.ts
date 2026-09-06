export interface CorrelationAsset {
  symbol: string;
  name: string;
  category: 'commodity' | 'dollar_index' | 'forex';
  tag: string;
  role: string;
  color: string;
}

export interface PairCorrelationDetail {
  pairKey: string; // e.g. "XAU/USD-DXY"
  assetA: string;
  assetB: string;
  rolling30d: number;
  structural90d: number;
  inflationRegime: number;
  direction: 'positive' | 'negative' | 'neutral';
  strengthLabel: 'Strong Positive' | 'Moderate Positive' | 'Uncorrelated / Mixed' | 'Moderate Negative' | 'Strong Negative';
  macroRationale: string;
  intermarketMechanism: string;
  divergenceAlert: string;
  actionableTradingRule: string;
}

export const CORRELATION_ASSETS: CorrelationAsset[] = [
  {
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    category: 'commodity',
    tag: 'Safe Haven & Bullion',
    role: 'Real yield inverse proxy & sovereign reserve asset',
    color: 'amber'
  },
  {
    symbol: 'WTI/USD',
    name: 'Crude Oil',
    category: 'commodity',
    tag: 'Energy & Industrial',
    role: 'Global growth engine & primary inflation input',
    color: 'orange'
  },
  {
    symbol: 'DXY',
    name: 'US Dollar Index',
    category: 'dollar_index',
    tag: 'Global Reserve Spine',
    role: 'Benchmark basket of 6 major trade-weighted currencies',
    color: 'cyan'
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / USD',
    category: 'forex',
    tag: '57.6% of DXY',
    role: 'ECB rate differential vs Fed & European sovereign liquidity',
    color: 'blue'
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar',
    category: 'forex',
    tag: 'Resource & Gold Exporter',
    role: 'High-beta commodity currency linked to China and mining exports',
    color: 'emerald'
  },
  {
    symbol: 'USD/JPY',
    name: 'USD / Japanese Yen',
    category: 'forex',
    tag: 'Carry Trade & Energy Importer',
    role: 'Yield spread proxy; Japan imports 99% of its crude oil',
    color: 'violet'
  },
  {
    symbol: 'USD/CHF',
    name: 'USD / Swiss Franc',
    category: 'forex',
    tag: 'European Safe Haven',
    role: 'Neutral banking capital flight & negative correlation to Euro risk',
    color: 'teal'
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound',
    category: 'forex',
    tag: 'Global Risk Beta',
    role: 'London financial liquidity & Bank of England inflation stance',
    color: 'indigo'
  }
];

// Comprehensive pairwise macro database
export const PAIR_CORRELATIONS: Record<string, PairCorrelationDetail> = {
  // GOLD PAIRINGS
  'XAU/USD-WTI/USD': {
    pairKey: 'XAU/USD-WTI/USD',
    assetA: 'XAU/USD',
    assetB: 'WTI/USD',
    rolling30d: 0.46,
    structural90d: 0.52,
    inflationRegime: 0.74,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'Both are tangible real commodities that rally during broad fiat purchasing power debasement and cost-push inflation spirals.',
    intermarketMechanism: 'Surging crude oil elevates CPI prints and inflation expectations (breakevens), which subsequently drives institutional investors into physical Gold as an inflation hedge.',
    divergenceAlert: 'If Crude Oil crashes on recession fears while Gold surges, it signals severe financial market panic / flight to safety rather than an inflation regime.',
    actionableTradingRule: 'Watch WTI inventory releases: a massive bullish oil breakout often precedes an upward repricing in Gold bullion within 24 to 48 hours.'
  },
  'XAU/USD-DXY': {
    pairKey: 'XAU/USD-DXY',
    assetA: 'XAU/USD',
    assetB: 'DXY',
    rolling30d: -0.84,
    structural90d: -0.81,
    inflationRegime: -0.62,
    direction: 'negative',
    strengthLabel: 'Strong Negative',
    macroRationale: 'Gold is priced internationally in US Dollars; higher USD purchasing power increases the effective cost of bullion for non-US central banks and investors.',
    intermarketMechanism: 'A stronger Dollar typically reflects higher real US Treasury yields. Because Gold pays zero nominal coupon, rising real yields increase the opportunity cost of holding metal.',
    divergenceAlert: 'When Gold and DXY rise TOGETHER, institutional capital is fleeing geopolitical turmoil or systemic sovereign debt stress, overriding normal currency math.',
    actionableTradingRule: 'Avoid longing Gold when DXY is breaking above daily macro resistance, unless real yields (US 10Y TIPS) are simultaneously dropping.'
  },
  'XAU/USD-EUR/USD': {
    pairKey: 'XAU/USD-EUR/USD',
    assetA: 'XAU/USD',
    assetB: 'EUR/USD',
    rolling30d: 0.73,
    structural90d: 0.76,
    inflationRegime: 0.68,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'EUR/USD comprises 57.6% of the DXY index. When EUR/USD strengthens, the Dollar index plummets, mechanically lifting dollar-denominated bullion.',
    intermarketMechanism: 'Shared inverse dollar elasticity. Dollar selling flows directly feed both Euro accumulation and physical London bullion fix bids.',
    divergenceAlert: 'If EUR/USD collapses due to ECB rate cuts while Gold remains resilient, sovereign de-dollarization flows are dominating exchange rate mechanics.',
    actionableTradingRule: 'Confirm Gold bullish breakouts by verifying EUR/USD is holding its session lows. Bullion rallies with a sinking EUR/USD lack broad institutional liquidity.'
  },
  'XAU/USD-AUD/USD': {
    pairKey: 'XAU/USD-AUD/USD',
    assetA: 'XAU/USD',
    assetB: 'AUD/USD',
    rolling30d: 0.78,
    structural90d: 0.82,
    inflationRegime: 0.88,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'Australia is the second-largest gold-producing nation in the world. High gold spot prices drastically improve Australia\'s trade balance and terms of trade.',
    intermarketMechanism: 'Mining multinationals convert USD bullion proceeds into Australian Dollars to fund domestic capex and dividends, directly creating AUD spot demand.',
    divergenceAlert: 'If Gold hits new record highs but AUD/USD lags heavily, China industrial metal demand (Iron Ore / Copper) is depressing Australian terms of trade.',
    actionableTradingRule: 'AUD/USD often serves as a leveraged liquid proxy for physical gold sentiment during Asian trading hours before the London metals open.'
  },
  'XAU/USD-USD/JPY': {
    pairKey: 'XAU/USD-USD/JPY',
    assetA: 'XAU/USD',
    assetB: 'USD/JPY',
    rolling30d: -0.56,
    structural90d: -0.61,
    inflationRegime: -0.38,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'USD/JPY moves directly with US 10-year Treasury yields. When US yields rise, USD/JPY rallies while non-yielding Gold suffers institutional liquidation.',
    intermarketMechanism: 'Both Gold and the Japanese Yen are classic global safe-haven destinations during systemic de-risking shocks.',
    divergenceAlert: 'During Bank of Japan intervention episodes, USD/JPY can plummet by 300 pips without moving Gold, reflecting pure currency intervention rather than macro sentiment.',
    actionableTradingRule: 'Track 10Y US Treasury yields: if yields peak and reverse downward, expect USD/JPY to roll over while Gold initiates an impulsive expansion.'
  },
  'XAU/USD-USD/CHF': {
    pairKey: 'XAU/USD-USD/CHF',
    assetA: 'XAU/USD',
    assetB: 'USD/CHF',
    rolling30d: -0.66,
    structural90d: -0.71,
    inflationRegime: -0.58,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'The Swiss Franc and Gold are Europe\'s ultimate defensive capital shelters. When fear escalates, both CHF and Gold appreciate against the Greenback.',
    intermarketMechanism: 'Swiss private banks are the world\'s largest custodians of physical bullion. Flight to Swiss banking security coincides with physical vaulted gold allocations.',
    divergenceAlert: 'When the Swiss National Bank (SNB) actively intervenes to weaken the Franc, USD/CHF may decouple temporarily from gold spot trends.',
    actionableTradingRule: 'A breakdown in USD/CHF below critical psychological support (e.g. 0.8800) frequently provides an early leading trigger for an aggressive Gold bull push.'
  },
  'XAU/USD-GBP/USD': {
    pairKey: 'XAU/USD-GBP/USD',
    assetA: 'XAU/USD',
    assetB: 'GBP/USD',
    rolling30d: 0.67,
    structural90d: 0.70,
    inflationRegime: 0.61,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'London is the premier OTC physical bullion settlement capital of the world (LBMA). Broad Sterling risk-on liquidity aligns with precious metals turnover.',
    intermarketMechanism: 'Weakness in the Dollar Index universally props up GBP/USD and bullion in tandem.',
    divergenceAlert: 'UK-specific fiscal announcements (e.g. Gilts sell-off) can drop GBP/USD without impairing gold bullion.',
    actionableTradingRule: 'Use GBP/USD London market open volatility to gauge whether institutional European desk books are entering dollar-short or dollar-long postures.'
  },

  // OIL PAIRINGS
  'WTI/USD-DXY': {
    pairKey: 'WTI/USD-DXY',
    assetA: 'WTI/USD',
    assetB: 'DXY',
    rolling30d: -0.58,
    structural90d: -0.62,
    inflationRegime: -0.45,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'Crude oil is denominated in USD across global tanker fixtures. An appreciating dollar increases energy import costs for consuming emerging economies, curbing demand.',
    intermarketMechanism: 'Dollar liquidity squeeze lowers speculative commodity futures open interest across NYMEX/ICE exchanges.',
    divergenceAlert: 'During Middle East supply embargoes or OPEC+ surprise output cuts, oil will surge violently regardless of how high the US Dollar climbs.',
    actionableTradingRule: 'In supply-driven shocks, the inverse oil-dollar correlation breaks down. Focus on OPEC spare capacity rather than Dollar momentum.'
  },
  'WTI/USD-EUR/USD': {
    pairKey: 'WTI/USD-EUR/USD',
    assetA: 'WTI/USD',
    assetB: 'EUR/USD',
    rolling30d: 0.51,
    structural90d: 0.54,
    inflationRegime: 0.42,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'A buoyant EUR/USD signals healthy global synchronized growth, industrial trade flows, and robust transport fuel consumption across the Eurozone.',
    intermarketMechanism: 'Weaker US dollar lowers dollar-settled crude import invoices for European refiners.',
    divergenceAlert: 'If high oil prices cause European chemical plants to shut down (terms of trade crisis), high oil will actually CRASH EUR/USD (stagflation decoupling).',
    actionableTradingRule: 'Assess whether oil moves are driven by strong demand (bullish EUR/USD) or severe supply disruptions (bearish EUR/USD terms of trade).'
  },
  'WTI/USD-AUD/USD': {
    pairKey: 'WTI/USD-AUD/USD',
    assetA: 'WTI/USD',
    assetB: 'AUD/USD',
    rolling30d: 0.64,
    structural90d: 0.68,
    inflationRegime: 0.78,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'Australia is a massive energy and liquefied natural gas (LNG) exporter. Asian spot LNG and thermal coal contracts trade at close parity to Brent/WTI crude benchmarks.',
    intermarketMechanism: 'Surging energy prices expand Australia\'s current account surplus and attract resource equity investment from global pension funds.',
    divergenceAlert: 'Domestic Australian central bank (RBA) dovish interest rate cuts can depress AUD even during an energy rally.',
    actionableTradingRule: 'Energy rallies provide fundamental wind at the back of long AUD/USD positions, especially when accompanied by copper and iron ore gains.'
  },
  'WTI/USD-USD/JPY': {
    pairKey: 'WTI/USD-USD/JPY',
    assetA: 'WTI/USD',
    assetB: 'USD/JPY',
    rolling30d: 0.36,
    structural90d: 0.42,
    inflationRegime: 0.65,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'Japan imports over 99% of its petroleum needs. When crude oil prices spike, Japan\'s trade balance suffers an immediate, severe structural deficit.',
    intermarketMechanism: 'Japanese energy importers are forced to dump Yen on the open spot market to purchase US Dollars to pay for physical Middle Eastern crude cargoes.',
    divergenceAlert: 'If high oil is accompanied by a severe global stock market crash, Yen safe-haven repatriation can overpower the energy trade deficit.',
    actionableTradingRule: 'A sustained breakout in WTI crude above $85/bbl is fundamentally bearish for the Japanese Yen, creating structural upward drift in USD/JPY.'
  },
  'WTI/USD-USD/CHF': {
    pairKey: 'WTI/USD-USD/CHF',
    assetA: 'WTI/USD',
    assetB: 'USD/CHF',
    rolling30d: -0.42,
    structural90d: -0.48,
    inflationRegime: -0.35,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'Higher oil generates global cost pressures; Switzerland boasts Europe\'s lowest inflation rate and highest hydro/nuclear energy independence, attracting defensive capital into CHF.',
    intermarketMechanism: 'Dollar weakness supporting oil generally pulls USD/CHF downward.',
    divergenceAlert: 'A broad US energy independence narrative can keep USD bid against European crosses.',
    actionableTradingRule: 'Monitor European energy benchmark spreads to confirm whether commodity pressure is localized or global.'
  },
  'WTI/USD-GBP/USD': {
    pairKey: 'WTI/USD-GBP/USD',
    assetA: 'WTI/USD',
    assetB: 'GBP/USD',
    rolling30d: 0.48,
    structural90d: 0.52,
    inflationRegime: 0.40,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'The UK possesses North Sea Brent assets and prominent multinational energy majors (Shell, BP) listed in London. Global energy strength lifts UK market beta.',
    intermarketMechanism: 'Broad risk appetite that fuels crude consumption also buoys Sterling against the defensive US Dollar.',
    divergenceAlert: 'Excessive domestic energy bills squeeze UK household disposable income, dampening Bank of England growth projections.',
    actionableTradingRule: 'Pair energy trends with UK retail sales data to determine whether oil is operating as an industrial tailwind or a consumer tax.'
  },

  // DXY PAIRINGS
  'DXY-EUR/USD': {
    pairKey: 'DXY-EUR/USD',
    assetA: 'DXY',
    assetB: 'EUR/USD',
    rolling30d: -0.93,
    structural90d: -0.95,
    inflationRegime: -0.92,
    direction: 'negative',
    strengthLabel: 'Strong Negative',
    macroRationale: 'EUR/USD commands a dominant 57.6% mathematical weighting in the US Dollar Index basket (ICE DXY).',
    intermarketMechanism: 'Direct inverse linear relationship. Any substantial institutional capital rotation between Wall Street and Frankfurt dictates DXY direction.',
    divergenceAlert: 'DXY and EUR/USD almost never diverge mathematically; minor discrepancies only occur if GBP or JPY experiences an extreme idiosyncratic event.',
    actionableTradingRule: 'Treat EUR/USD as the primary real-time liquidity mirror of DXY. Setting alerts on EUR/USD support levels directly mirrors DXY resistance tests.'
  },
  'DXY-AUD/USD': {
    pairKey: 'DXY-AUD/USD',
    assetA: 'DXY',
    assetB: 'AUD/USD',
    rolling30d: -0.77,
    structural90d: -0.80,
    inflationRegime: -0.74,
    direction: 'negative',
    strengthLabel: 'Strong Negative',
    macroRationale: 'AUD/USD is the highest-beta risk asset in the G10 currency complex, moving inversely to the defensive reserve dollar.',
    intermarketMechanism: 'When global financial conditions tighten and the Dollar surges, institutional liquidity pulls capital out of emerging markets and commodity-exporting currencies like AUD.',
    divergenceAlert: 'A localized commodity supply crunch (iron ore or gold squeeze) can cause AUD to rally even amidst broad USD resilience.',
    actionableTradingRule: 'When DXY is trending strongly, AUD/USD typically experiences 1.3x to 1.5x larger percentage swings than EUR/USD due to its elevated beta.'
  },
  'DXY-USD/JPY': {
    pairKey: 'DXY-USD/JPY',
    assetA: 'DXY',
    assetB: 'USD/JPY',
    rolling30d: 0.71,
    structural90d: 0.75,
    inflationRegime: 0.82,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'Both reflect US interest rate expectations and Federal Reserve policy tightness. When US yields rise, DXY surges and USD/JPY carries higher.',
    intermarketMechanism: 'The USD/JPY 10Y government bond spread is the primary driver of global foreign exchange carry trades.',
    divergenceAlert: 'When the US Dollar drops during a severe equity market collapse, USD/JPY crashes even harder due to rapid Yen carry-trade liquidation.',
    actionableTradingRule: 'A simultaneous rally in DXY and USD/JPY confirms that the market is actively repricing Federal Reserve interest rates higher.'
  },
  'DXY-USD/CHF': {
    pairKey: 'DXY-USD/CHF',
    assetA: 'DXY',
    assetB: 'USD/CHF',
    rolling30d: 0.81,
    structural90d: 0.84,
    inflationRegime: 0.79,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'USD/CHF shares European economic proximity with the Eurozone. General dollar strength drives USD/CHF higher in close symmetry with EUR/USD declines.',
    intermarketMechanism: 'Positive carry differentials favoring the US Dollar over negative or low Swiss deposit rates.',
    divergenceAlert: 'During severe European banking contagion or systemic shocks, the Swiss Franc can surge against ALL currencies including the US Dollar.',
    actionableTradingRule: 'Use USD/CHF as an institutional confirmation tool when assessing the longevity of a DXY bullish breakout.'
  },
  'DXY-GBP/USD': {
    pairKey: 'DXY-GBP/USD',
    assetA: 'DXY',
    assetB: 'GBP/USD',
    rolling30d: -0.87,
    structural90d: -0.89,
    inflationRegime: -0.85,
    direction: 'negative',
    strengthLabel: 'Strong Negative',
    macroRationale: 'The British Pound constitutes an 11.9% weight in the DXY basket and responds directly to transatlantic interest rate differentials.',
    intermarketMechanism: 'Global institutional fund allocations shift between US Dollar fixed income instruments and UK sovereign Gilts.',
    divergenceAlert: 'UK political instability or standalone Bank of England policy surprises can cause GBP/USD to detach from standard DXY correlations.',
    actionableTradingRule: 'Trade GBP/USD during US CPI or Non-Farm Payrolls with the awareness that DXY surprise momentum will transmit immediately into Cable.'
  },

  // EUR/USD PAIRINGS
  'EUR/USD-AUD/USD': {
    pairKey: 'EUR/USD-AUD/USD',
    assetA: 'EUR/USD',
    assetB: 'AUD/USD',
    rolling30d: 0.72,
    structural90d: 0.75,
    inflationRegime: 0.69,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'Both are prime non-dollar cyclical currencies that thrive during periods of global monetary easing and expanding world trade.',
    intermarketMechanism: 'Both benefit from broad-based dollar selling waves and global risk-on market sentiment.',
    divergenceAlert: 'China economic slowdowns severely penalize AUD while leaving Eurozone domestic demand relatively insulated, leading to EUR/AUD appreciation.',
    actionableTradingRule: 'Cross-check the EUR/AUD synthetic cross: when commodity prices lead economic growth, AUD will outperform EUR.'
  },
  'EUR/USD-USD/JPY': {
    pairKey: 'EUR/USD-USD/JPY',
    assetA: 'EUR/USD',
    assetB: 'USD/JPY',
    rolling30d: -0.47,
    structural90d: -0.52,
    inflationRegime: -0.41,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'Dollar strength drives USD/JPY up while depressing EUR/USD, establishing an underlying inverse dynamic.',
    intermarketMechanism: 'Relative rate policy divergence between the ECB, Federal Reserve, and Bank of Japan.',
    divergenceAlert: 'In EUR/JPY momentum expansions, both EUR/USD and USD/JPY can rise simultaneously if the Yen is being liquidated universally.',
    actionableTradingRule: 'When analyzing USD/JPY, monitor EUR/USD to determine whether the move is isolated Yen weakness or broad USD strength.'
  },
  'EUR/USD-USD/CHF': {
    pairKey: 'EUR/USD-USD/CHF',
    assetA: 'EUR/USD',
    assetB: 'USD/CHF',
    rolling30d: -0.83,
    structural90d: -0.86,
    inflationRegime: -0.81,
    direction: 'negative',
    strengthLabel: 'Strong Negative',
    macroRationale: 'Near-perfect inverse relationship due to Swiss Franc peg history and tight trade integration between Switzerland and the Euro area.',
    intermarketMechanism: 'USD in the denominator of EUR/USD and the numerator of USD/CHF creates high mechanical inversion.',
    divergenceAlert: 'Deviations only occur during active Swiss National Bank FX interventions or localized European geopolitical shocks.',
    actionableTradingRule: 'A bullish setup on EUR/USD coupled with a confirmed breakdown on USD/CHF provides an extremely high-conviction intermarket confluence.'
  },
  'EUR/USD-GBP/USD': {
    pairKey: 'EUR/USD-GBP/USD',
    assetA: 'EUR/USD',
    assetB: 'GBP/USD',
    rolling30d: 0.79,
    structural90d: 0.83,
    inflationRegime: 0.76,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'The European and British economies are deeply intertwined by geography, supply chains, and overlapping financial market trading sessions.',
    intermarketMechanism: 'Both trade as the core European non-dollar currency block during the London/New York overlap.',
    divergenceAlert: 'Divergence in BoE vs ECB inflation trajectories creates actionable trends in the EUR/GBP cross pair.',
    actionableTradingRule: 'If EUR/USD is rallying but GBP/USD is stalling at resistance, institutional money is rotating selectively into the Euro.'
  },

  // AUD/USD PAIRINGS
  'AUD/USD-USD/JPY': {
    pairKey: 'AUD/USD-USD/JPY',
    assetA: 'AUD/USD',
    assetB: 'USD/JPY',
    rolling30d: 0.28,
    structural90d: 0.34,
    inflationRegime: 0.44,
    direction: 'positive',
    strengthLabel: 'Uncorrelated / Mixed',
    macroRationale: 'Complex interaction between the Aussie risk-on commodity cycle and the Japanese Yen carry trade financing regime.',
    intermarketMechanism: 'When risk appetite is strong, investors borrow cheap Yen to invest in higher-yielding Australian assets (AUD/JPY carry trade).',
    divergenceAlert: 'During a Fed rate-hiking cycle, USD/JPY can soar while AUD/USD drops due to equity market risk aversion.',
    actionableTradingRule: 'Trade the AUD/JPY cross directly if your thesis is pure global risk-on vs safe haven carry dynamics.'
  },
  'AUD/USD-USD/CHF': {
    pairKey: 'AUD/USD-USD/CHF',
    assetA: 'AUD/USD',
    assetB: 'USD/CHF',
    rolling30d: -0.57,
    structural90d: -0.63,
    inflationRegime: -0.52,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'Contrasts a high-beta commodity exporter currency against the classic European low-beta defensive safe haven.',
    intermarketMechanism: 'When the Dollar strengthens broadly, USD/CHF climbs while AUD/USD experiences liquidation.',
    divergenceAlert: 'During extreme equity rallies, AUD outpaces all European currencies, widening the inverse spread.',
    actionableTradingRule: 'Use AUD/CHF ratio to track institutional risk appetite: a rising ratio indicates aggressive global growth optimism.'
  },
  'AUD/USD-GBP/USD': {
    pairKey: 'AUD/USD-GBP/USD',
    assetA: 'AUD/USD',
    assetB: 'GBP/USD',
    rolling30d: 0.74,
    structural90d: 0.78,
    inflationRegime: 0.71,
    direction: 'positive',
    strengthLabel: 'Strong Positive',
    macroRationale: 'Both currencies rally during broad US dollar liquidation and global liquidity expansion cycles.',
    intermarketMechanism: 'Commonwealth financial links and shared sensitivity to international risk sentiment.',
    divergenceAlert: 'China economic data will move AUD independently of GBP, while UK domestic fiscal policies dictate GBP idiosyncratic moves.',
    actionableTradingRule: 'Evaluate the GBP/AUD cross to trade pure relative macroeconomic divergence between the UK and Asia-Pacific economies.'
  },

  // USD/JPY PAIRINGS
  'USD/JPY-USD/CHF': {
    pairKey: 'USD/JPY-USD/CHF',
    assetA: 'USD/JPY',
    assetB: 'USD/CHF',
    rolling30d: 0.54,
    structural90d: 0.58,
    inflationRegime: 0.62,
    direction: 'positive',
    strengthLabel: 'Moderate Positive',
    macroRationale: 'Both pairs have the US Dollar as the base currency, and both JPY and CHF function as traditional low-yielding funding currencies.',
    intermarketMechanism: 'Shared sensitivity to US monetary policy tightening and Federal Reserve benchmark rates.',
    divergenceAlert: 'The SNB can run independent monetary policy far more easily than the BoJ due to Switzerland\'s structural current account surplus and low inflation.',
    actionableTradingRule: 'When US 10Y yields surge, both USD/JPY and USD/CHF display strong positive momentum.'
  },
  'USD/JPY-GBP/USD': {
    pairKey: 'USD/JPY-GBP/USD',
    assetA: 'USD/JPY',
    assetB: 'GBP/USD',
    rolling30d: -0.49,
    structural90d: -0.55,
    inflationRegime: -0.44,
    direction: 'negative',
    strengthLabel: 'Moderate Negative',
    macroRationale: 'Reflects the general impact of the US Dollar: a rising Dollar lifts USD/JPY while putting downward pressure on GBP/USD.',
    intermarketMechanism: 'Transatlantic versus transpacific capital allocation decisions among institutional sovereign funds.',
    divergenceAlert: 'During aggressive global stock market rallies, GBP/JPY surges, causing USD/JPY and GBP/USD to both gain ground against the Dollar.',
    actionableTradingRule: 'Check GBP/JPY to identify whether Pound strength or Yen weakness is the primary driver in European market sessions.'
  },

  // USD/CHF PAIRINGS
  'USD/CHF-GBP/USD': {
    pairKey: 'USD/CHF-GBP/USD',
    assetA: 'USD/CHF',
    assetB: 'GBP/USD',
    rolling30d: -0.76,
    structural90d: -0.80,
    inflationRegime: -0.73,
    direction: 'negative',
    strengthLabel: 'Strong Negative',
    macroRationale: 'European currency geometry: Sterling weakness almost always translates into Swiss Franc relative strength versus the Pound and Greenback.',
    intermarketMechanism: 'Inversion caused by USD being the base currency in USD/CHF and quote currency in GBP/USD.',
    divergenceAlert: 'SNB or BoE unexpected policy rate moves can temporarily distort cross-border arbitrage.',
    actionableTradingRule: 'Observe the GBP/CHF cross at major psychological round numbers (e.g. 1.1000) for high-probability mean-reversion setups.'
  }
};

// Helper to look up correlation between any two assets in either order
export function getPairCorrelation(assetA: string, assetB: string): PairCorrelationDetail | null {
  if (assetA === assetB) {
    return {
      pairKey: `${assetA}-${assetB}`,
      assetA,
      assetB,
      rolling30d: 1.00,
      structural90d: 1.00,
      inflationRegime: 1.00,
      direction: 'positive',
      strengthLabel: 'Strong Positive',
      macroRationale: 'Identity relationship: An asset has a 1.00 perfect correlation with itself.',
      intermarketMechanism: 'Self-correlation baseline benchmark.',
      divergenceAlert: 'None (Perfect Self-Correlation).',
      actionableTradingRule: 'Use as the neutral 1.00 reference point for evaluating all other intermarket pairs.'
    };
  }

  const key1 = `${assetA}-${assetB}`;
  const key2 = `${assetB}-${assetA}`;
  return PAIR_CORRELATIONS[key1] || PAIR_CORRELATIONS[key2] || null;
}

// Quick takeaways for institutional summary
export const CORRELATION_KEY_INSIGHTS = [
  {
    title: 'The Dollar-Gold Anchor (-0.84)',
    badge: 'Inverse Mirror',
    color: 'rose',
    summary: 'Gold remains strictly an inverse proxy for DXY and real yields. If DXY breaks higher without geopolitical panic, Gold face-plants.'
  },
  {
    title: 'Commodity Resource Link (+0.78)',
    badge: 'Production Beta',
    color: 'emerald',
    summary: 'AUD/USD tracks Gold bullion bids closer than any other G10 pair. Australia\'s mining balance directly turns gold into foreign exchange demand.'
  },
  {
    title: 'Crude Oil Terms of Trade (+0.36 USD/JPY)',
    badge: 'Energy Deficit',
    color: 'amber',
    summary: 'Spikes in WTI crude weaken the Japanese Yen (lifting USD/JPY) because Japan must import 99% of its fossil fuel needs in USD.'
  },
  {
    title: 'EUR/USD Sovereign Spine (-0.93 DXY)',
    badge: 'Index Weight',
    color: 'cyan',
    summary: 'Comprising 57.6% of the DXY basket, EUR/USD is the mathematical inverse of the dollar. Never trade them on conflicting directional hypotheses.'
  }
];
