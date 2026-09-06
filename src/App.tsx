/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_WATCHLIST, 
  INITIAL_ECONOMIC_EVENTS, 
  HISTORICAL_IMPACT_STATS 
} from './data/forexFactoryData';
import { REAL_TIME_MACRO_NEWS } from './data/economicData';
import { WatchlistAsset, EconomicEvent, PriceAlert, RealNewsItem, OnScreenAlertNotice } from './types';
import { Header } from './components/Header';
import { OnScreenAlertsBar } from './components/OnScreenAlertsBar';
import { AiMacroDesk } from './components/AiMacroDesk';
import { EconomicDictionary } from './components/EconomicDictionary';
import { WatchlistGrid } from './components/WatchlistGrid';
import { CauseReactionHub } from './components/CauseReactionHub';
import { EconomicCalendarTable } from './components/EconomicCalendarTable';
import { DriverExplainerSection } from './components/DriverExplainerSection';
import { AlertsManager } from './components/AlertsManager';
import { DesktopCockpit } from './components/DesktopCockpit';
import { SignalsOnlyBoard } from './components/SignalsOnlyBoard';
import { ToastNotification } from './components/ToastNotification';
import { soundEngine } from './utils/audioAlert';
import { sendBrowserPushNotification, ToastAlert } from './utils/notifications';
import { 
  loadCachedEvents, 
  saveCachedEvents, 
  loadCachedWatchlist, 
  saveCachedWatchlist,
  loadAlerts,
  saveAlerts,
  getLastSyncTime,
  saveLastSyncTime,
  getThemePreference,
  setThemePreference,
  getAudioPref,
  setAudioPref
} from './utils/offlineStorage';
import { fetchLiveMarketDataClient } from './utils/liveMarketClient';
import { WifiOff, ShieldAlert, Sparkles, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // View mode: 'cockpit' (Desktop 1-screen, no scrolling) vs 'flow' (multi-section)
  const [viewMode, setViewMode] = useState<'cockpit' | 'flow'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return 'flow';
    }
    return 'cockpit';
  });

  // Signals-Only Mode: 1-Click button to remove all details and show ONLY Hot Buy / Hot Sell / Buy / Sell / Neutral
  const [isSignalsOnly, setIsSignalsOnly] = useState<boolean>(false);

  // Theme state (default dark financial terminal)
  const [isDark, setIsDark] = useState<boolean>(() => getThemePreference() === 'dark');
  const [isAudioOn, setIsAudioOn] = useState<boolean>(() => getAudioPref());
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => getLastSyncTime());

  // Real News items state
  const [newsItems, setNewsItems] = useState<RealNewsItem[]>(REAL_TIME_MACRO_NEWS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // On-screen Alert Notices state
  const [onScreenNotices, setOnScreenNotices] = useState<OnScreenAlertNotice[]>([
    {
      id: 'notice-cpi-hot',
      type: 'macro_warning',
      title: 'US Core CPI Surprise',
      message: 'Hotter 0.3% release lifted 10Y Yields by 7bps. Gold support active at $2,830.',
      timestamp: 'Today, 08:30',
      severity: 'critical',
      assetSymbol: 'XAU/USD',
    }
  ]);

  // Data states
  const [watchlist, setWatchlist] = useState<WatchlistAsset[]>(() => {
    const cached = loadCachedWatchlist();
    if (!cached || !Array.isArray(cached) || cached.length === 0) {
      return INITIAL_WATCHLIST;
    }
    // Deep-merge cached assets with INITIAL_WATCHLIST so any newly added assets (DXY, USD/CHF, MNQ, MES)
    // and newly added properties (clusterId, technicalStance, rsi, etc.) are always fully populated
    const cachedMap = new Map(cached.map(a => [a.symbol, a]));
    return INITIAL_WATCHLIST.map(initial => {
      const fromCache = cachedMap.get(initial.symbol);
      if (!fromCache) return initial;
      // If cache has outdated legacy placeholder prices (e.g. Gold below 3500 or MNQ below 25000), reset to initial
      if (initial.symbol === 'XAU/USD' && fromCache.price < 3500) return initial;
      if (initial.symbol === 'MNQ' && fromCache.price < 25000) return initial;
      if (initial.symbol === 'MES' && fromCache.price < 6500) return initial;
      return {
        ...initial,
        ...fromCache,
        clusterId: fromCache.clusterId || initial.clusterId,
        clusterName: fromCache.clusterName || initial.clusterName,
        clusterPairDescription: fromCache.clusterPairDescription || initial.clusterPairDescription,
        technicalStance: fromCache.technicalStance || initial.technicalStance,
        institutionalBias: fromCache.institutionalBias || initial.institutionalBias,
        whaleFlow: fromCache.whaleFlow || initial.whaleFlow,
        volumeStatus: fromCache.volumeStatus || initial.volumeStatus,
        rsi: typeof fromCache.rsi === 'number' ? fromCache.rsi : initial.rsi,
        whyItsMoving: fromCache.whyItsMoving || initial.whyItsMoving,
        intermarketCorrelation: fromCache.intermarketCorrelation || initial.intermarketCorrelation,
        keySupportResistance: fromCache.keySupportResistance || initial.keySupportResistance,
        primaryDriver: fromCache.primaryDriver || initial.primaryDriver,
      };
    });
  });

  const [calendarEvents, setCalendarEvents] = useState<EconomicEvent[]>(() => {
    return loadCachedEvents() || INITIAL_ECONOMIC_EVENTS;
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = loadAlerts();
    if (saved && saved.length > 0) return saved;
    return [
      {
        id: 'alert-gold-01',
        symbol: 'XAU/USD',
        condition: 'above',
        targetPrice: 2855.00,
        createdPrice: 2848.40,
        createdAt: 'Today, 10:15',
        active: true,
        triggered: false,
      },
      {
        id: 'alert-oil-02',
        symbol: 'WTI/USD',
        condition: 'below',
        targetPrice: 74.00,
        createdPrice: 74.85,
        createdAt: 'Today, 11:30',
        active: true,
        triggered: false,
      },
      {
        id: 'alert-eur-03',
        symbol: 'EUR/USD',
        condition: 'below',
        targetPrice: 1.0800,
        createdPrice: 1.0842,
        createdAt: 'Today, 12:00',
        active: true,
        triggered: false,
      },
    ];
  });

  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('XAU/USD');
  const [countdownText, setCountdownText] = useState<string>('00:34:15');

  // Sync theme to root DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#090d16';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc';
    }
    setThemePreference(isDark ? 'dark' : 'light');
  }, [isDark]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Countdown timer for next high-impact event
  useEffect(() => {
    const timer = setInterval(() => {
      // Find upcoming high impact event
      const upcoming = calendarEvents.find(e => e.status === 'upcoming' && e.impact === 'high');
      if (upcoming) {
        const diffMs = Math.max(0, upcoming.timestamp - Date.now());
        const totalSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        setCountdownText(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      } else {
        setCountdownText('00:35:00');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calendarEvents]);

  // Toast dispatcher helper
  const addToast = useCallback((toast: Omit<ToastAlert, 'id' | 'timestamp'>) => {
    const newToast: ToastAlert = {
      ...toast,
      id: 'toast-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setToasts(prev => [newToast, ...prev.slice(0, 3)]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 6000);
  }, []);

  // Check price alerts against live prices
  const checkAlertsAgainstPrices = useCallback((currentWatchlist: WatchlistAsset[]) => {
    setAlerts(prevAlerts => {
      let anyTriggered = false;
      const updated = prevAlerts.map(alert => {
        if (!alert.active || alert.triggered) return alert;

        const asset = currentWatchlist.find(a => a.symbol === alert.symbol);
        if (!asset) return alert;

        let shouldTrigger = false;
        if (alert.condition === 'above' && asset.price >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && asset.price <= alert.targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          anyTriggered = true;
          // Play sound
          if (isAudioOn) {
            soundEngine.playPriceAlertChime();
          }

          // Push Notification
          const title = `🚨 Target Price Hit: ${alert.symbol}`;
          const body = `${alert.symbol} reached ${alert.condition === 'above' ? 'above' : 'below'} $${alert.targetPrice.toLocaleString()} (Current: ${asset.displayPrice})`;
          sendBrowserPushNotification(title, { body });

          // In-app toast
          addToast({
            type: 'price',
            title,
            message: body,
            badge: `${alert.symbol} TRIGGER`,
          });

          return {
            ...alert,
            triggered: true,
            triggeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }

        return alert;
      });

      if (anyTriggered) {
        saveAlerts(updated);
      }
      return updated;
    });
  }, [isAudioOn, addToast]);

  // Live orderbook & price tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => {
        const updated = prev.map(asset => {
          // Generate small micro tick
          let delta = 0;
          let newPrice = asset.price;

          if (asset.symbol === 'XAU/USD') {
            // Gold tick (±$0.30 - $0.80)
            delta = (Math.random() - 0.48) * 0.7;
            newPrice = parseFloat((asset.price + delta).toFixed(2));
          } else if (asset.symbol === 'WTI/USD') {
            // Oil tick (±$0.03 - $0.08)
            delta = (Math.random() - 0.52) * 0.08;
            newPrice = parseFloat((asset.price + delta).toFixed(2));
          } else {
            // Forex tick (±0.0001 - 0.0004)
            delta = (Math.random() - 0.5) * 0.0003;
            newPrice = parseFloat((asset.price + delta).toFixed(4));
          }

          const change24h = parseFloat((asset.change24h + delta).toFixed(asset.category === 'commodity' ? 2 : 4));
          const changePercent = parseFloat(((change24h / (asset.price - change24h)) * 100).toFixed(2));
          const pipChange = asset.category === 'commodity' ? Math.round(change24h * 10) : Math.round(change24h * 10000);

          const displayPrice = asset.symbol === 'XAU/USD' || asset.symbol === 'WTI/USD'
            ? `$${newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : newPrice.toFixed(4);

          return {
            ...asset,
            price: newPrice,
            displayPrice,
            change24h,
            changePercent,
            pipChange,
          };
        });

        // Save to cache
        saveCachedWatchlist(updated);

        // Check if any price alert was triggered by this tick
        checkAlertsAgainstPrices(updated);

        return updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [checkAlertsAgainstPrices]);

  // Handlers for Toggles & Controls
  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleToggleAudio = () => {
    setIsAudioOn(prev => {
      const next = !prev;
      setAudioPref(next);
      if (next) soundEngine.playPriceAlertChime();
      return next;
    });
  };

  const handleToggleEventAlert = (eventId: string) => {
    setCalendarEvents(prev => {
      const updated = prev.map(ev => {
        if (ev.id === eventId) {
          const nextState = !ev.alertSubscribed;
          if (nextState) {
            addToast({
              type: 'news',
              title: `Alert Armed: ${ev.currency} ${ev.title}`,
              message: `You will be notified immediately when ${ev.title} is released.`,
              badge: `${ev.currency} NEWS ALERT`,
            });
            if (isAudioOn) soundEngine.playHighImpactChime();
          }
          return { ...ev, alertSubscribed: nextState };
        }
        return ev;
      });
      saveCachedEvents(updated);
      return updated;
    });
  };

  // Add Price Alert
  const handleAddPriceAlert = (newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...newAlertData,
      id: 'alert-' + Date.now(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      triggered: false,
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveAlerts(updated);

    addToast({
      type: 'price',
      title: `Price Alert Set: ${newAlert.symbol}`,
      message: `Monitoring ${newAlert.symbol} for target ${newAlert.condition === 'above' ? '≥' : '≤'} $${newAlert.targetPrice.toLocaleString()}`,
      badge: 'ALERT ARMED',
    });
  };

  const handleDeleteAlert = (id: string) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  };

  const handleToggleAlertActive = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, active: !a.active } : a);
    setAlerts(updated);
    saveAlerts(updated);
  };

  // Fire a manual test alert to demonstrate instant real-time audio and push notification
  const handleFireTestAlert = () => {
    if (isAudioOn) {
      soundEngine.playHighImpactChime();
    }
    const title = '⚡ High-Impact Release: US Core CPI Beat';
    const body = 'Actual: 0.3% vs 0.2% Forecast. Gold dumped -$16.20 in 60 seconds; USD rallied +48 pips across major pairs.';
    sendBrowserPushNotification(title, { body });

    addToast({
      type: 'news',
      title,
      message: body,
      badge: 'USD HIGH-IMPACT',
    });
  };

  // Sync Real Market Data & Live Rates from backend OR direct exchange APIs on GitHub Pages
  const handleSyncRealData = async (silent = false) => {
    setIsSyncing(true);
    try {
      // 1. Fetch live quotes via hybrid client (tries backend first, then direct CORS exchange APIs)
      const clientResult = await fetchLiveMarketDataClient();

      if (clientResult.quotes && Object.keys(clientResult.quotes).length > 0) {
        setWatchlist(prev => prev.map(asset => {
          const quote = clientResult.quotes[asset.symbol];
          if (quote) {
            return {
              ...asset,
              price: quote.price,
              displayPrice: quote.displayPrice || (asset.category === 'commodity' ? `$${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : quote.price.toFixed(4)),
              change24h: quote.change24h !== undefined ? quote.change24h : asset.change24h,
              changePercent: quote.changePercent !== undefined ? quote.changePercent : asset.changePercent,
              high24h: quote.high24h || asset.high24h,
              low24h: quote.low24h || asset.low24h,
              sparkline: quote.sparkline && quote.sparkline.length > 0 ? quote.sparkline : asset.sparkline,
            };
          }
          return asset;
        }));

        const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(nowFormatted);
        saveLastSyncTime(nowFormatted);

        if (!silent) {
          addToast({
            type: 'price',
            title: clientResult.source === 'backend' ? 'Live Institutional Feed Synced' : 'Live Spot Exchange Rates Synced',
            message: clientResult.source === 'backend' 
              ? 'Institutional feed refreshed across Gold, Oil, DXY, FX & Futures.' 
              : 'Direct exchange feed connected: Spot Gold & Live Central Bank FX Rates updated.',
            badge: clientResult.source === 'backend' ? 'LIVE BACKEND' : 'LIVE EXCHANGE',
          });
        }
      }

      // 2. Fetch calendar events if backend is present
      try {
        const calendarRes = await fetch('/api/market/calendar', { signal: AbortSignal.timeout(2500) });
        if (calendarRes.ok) {
          const calData = await calendarRes.json();
          if (calData.events && Array.isArray(calData.events) && calData.events.length > 0) {
            setCalendarEvents(calData.events);
            saveCachedEvents(calData.events);
          }
        }
      } catch {
        // Backend calendar optional on static pages
      }
    } catch (e) {
      console.error('Market sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Immediate sync on initial render + 30s live heartbeat
  useEffect(() => {
    handleSyncRealData(true);
    const interval = setInterval(() => {
      handleSyncRealData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Arm quick alert directly from watchlist card
  const handleSelectForAlert = (asset: WatchlistAsset) => {
    setSelectedAssetSymbol(asset.symbol);
    const targetPrice = asset.symbol === 'XAU/USD'
      ? asset.price + 10
      : asset.symbol === 'WTI/USD'
        ? asset.price + 1.0
        : parseFloat((asset.price + 0.004).toFixed(4));

    handleAddPriceAlert({
      symbol: asset.symbol,
      condition: 'above',
      targetPrice,
      createdPrice: asset.price,
      active: true,
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Application Header */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        isOnline={isOnline}
        lastSyncTime={lastSyncTime}
        nextHighImpactTime={countdownText}
        nextHighImpactTitle="Unemployment Claims (USD)"
        onFireTestAlert={handleFireTestAlert}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => prev === 'cockpit' ? 'flow' : 'cockpit')}
        isSignalsOnly={isSignalsOnly}
        onToggleSignalsOnly={() => setIsSignalsOnly(prev => !prev)}
        onSyncRealData={handleSyncRealData}
        isSyncing={isSyncing}
      />

      {/* ONE-CLICK SIGNALS-ONLY RADAR VIEW (REMOVES ALL DETAILS, SHOWS ONLY HOT BUY/HOT SELL/BUY/SELL/NEUTRAL) */}
      {isSignalsOnly ? (
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <SignalsOnlyBoard
            assets={watchlist}
            isDark={isDark}
            onSelectAsset={(symbol) => {
              setSelectedAssetSymbol(symbol);
              setIsSignalsOnly(false);
            }}
            onSelectForAlert={handleSelectForAlert}
            onExitSignalsOnly={() => setIsSignalsOnly(false)}
          />
        </main>
      ) : viewMode === 'cockpit' ? (
        <DesktopCockpit
          watchlist={watchlist}
          calendarEvents={calendarEvents}
          alerts={alerts}
          isDark={isDark}
          selectedAssetSymbol={selectedAssetSymbol}
          onSelectAsset={(symbol) => setSelectedAssetSymbol(symbol)}
          onAddAlert={handleAddPriceAlert}
          onFireTestAlert={handleFireTestAlert}
          isAudioOn={isAudioOn}
          onToggleAudio={handleToggleAudio}
          onSyncRealData={handleSyncRealData}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
          newsItems={newsItems}
          activeNotices={onScreenNotices}
          onDismissNotice={(id) => setOnScreenNotices(prev => prev.filter(n => n.id !== id))}
          onToggleSignalsOnly={() => setIsSignalsOnly(prev => !prev)}
        />
      ) : (
        /* VIEWPORT MODE 2: EXPANDED MULTI-SECTION FLOW */
        <>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-7">
            
            {/* On-Screen Alerts Banner & Live Watcher Feed (Visible directly on screen!) */}
            <section id="section-on-screen-alerts">
              <OnScreenAlertsBar
                alerts={alerts}
                watchlist={watchlist}
                isDark={isDark}
                isAudioOn={isAudioOn}
                onToggleAudio={handleToggleAudio}
                onAddAlert={handleAddPriceAlert}
                onDeleteAlert={handleDeleteAlert}
                onToggleAlertActive={handleToggleAlertActive}
                onFireTestAlert={handleFireTestAlert}
                activeNotices={onScreenNotices}
                onDismissNotice={(id) => setOnScreenNotices(prev => prev.filter(n => n.id !== id))}
              />
            </section>

            {/* Offline Banner if disconnected */}
            {!isOnline && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>
                    <strong>Offline Mode Active:</strong> Serving cached economic calendar events and saved watchlists. All analysis remains interactive without internet.
                  </span>
                </div>
                <span className="text-[11px] opacity-80 font-sans">
                  Cached snapshot: {lastSyncTime}
                </span>
              </div>
            )}

            {/* Section 1: Major Watchlist & Live Reaction Radar */}
            <section id="section-watchlist">
              <WatchlistGrid
                assets={watchlist}
                isDark={isDark}
                onSelectForAlert={handleSelectForAlert}
                selectedAssetSymbol={selectedAssetSymbol}
                onSelectAsset={(symbol) => setSelectedAssetSymbol(symbol)}
                onToggleSignalsOnly={() => setIsSignalsOnly(prev => !prev)}
              />
            </section>

            {/* Section 2: AI Macro Intelligence Desk & Live Pulse (Gemini Powered) */}
            <section id="section-ai-desk">
              <AiMacroDesk
                watchlist={watchlist}
                isDark={isDark}
                selectedAssetSymbol={selectedAssetSymbol}
                onSelectAsset={(symbol) => setSelectedAssetSymbol(symbol)}
              />
            </section>

            {/* Section 3: Economic Dictionary & Real-Time Macro News (GDP, Jobs, Inflation Explained) */}
            <section id="section-economic-dictionary">
              <EconomicDictionary
                isDark={isDark}
                newsItems={newsItems}
                onSyncNews={handleSyncRealData}
                isSyncing={isSyncing}
              />
            </section>

            {/* Section 4: Cause & Reaction Engine (Macro News vs Asset Reaction + Volatility Visualizer) */}
            <section id="section-cause-reaction">
              <CauseReactionHub
                isDark={isDark}
                historicalStats={HISTORICAL_IMPACT_STATS}
                activeVolatilityScore={78}
                watchlist={watchlist}
              />
            </section>

            {/* Section 5: Global Economic Calendar Table */}
            <section id="section-calendar">
              <EconomicCalendarTable
                events={calendarEvents}
                isDark={isDark}
                onToggleEventAlert={handleToggleEventAlert}
              />
            </section>

            {/* Section 6: Market Driver Intelligence Matrix (Whale vs Institutional vs Macro vs Noise) */}
            <section id="section-driver-matrix">
              <DriverExplainerSection isDark={isDark} />
            </section>

            {/* Section 7: Detailed Price Alerts & Audio Watcher Configuration */}
            <section id="section-alerts">
              <AlertsManager
                alerts={alerts}
                watchlist={watchlist}
                isDark={isDark}
                onAddAlert={handleAddPriceAlert}
                onDeleteAlert={handleDeleteAlert}
                onToggleAlertActive={handleToggleAlertActive}
                onTriggerTestAlert={handleFireTestAlert}
              />
            </section>
          </main>

          {/* Clean, Non-intrusive Footer */}
          <footer className={`mt-12 border-t py-6 text-xs text-center font-mono ${
            isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
          }`}>
            <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
              <span>MacroPulse Economic Calendar • Cause & Reaction Analysis Engine</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Offline-Ready Cache Synced
              </span>
            </div>
          </footer>
        </>
      )}

      {/* Floating In-App Toast Notifications */}
      <ToastNotification
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
        isDark={isDark}
      />
    </div>
  );
}
