import { EconomicEvent, WatchlistAsset, PriceAlert } from '../types';

const STORAGE_KEYS = {
  CALENDAR_EVENTS: 'macropulse_cached_events_v3',
  WATCHLIST: 'macropulse_cached_watchlist_v3',
  ALERTS: 'macropulse_cached_alerts_v2',
  LAST_SYNC: 'macropulse_last_sync_time_v2',
  THEME: 'macropulse_theme_mode_v1',
  AUDIO_ENABLED: 'macropulse_audio_alerts_enabled_v1',
  NOTIFICATIONS_ENABLED: 'macropulse_push_notifications_enabled_v1',
};

export function saveCachedEvents(events: EconomicEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.error('Failed to cache calendar events', e);
  }
}

export function saveLastSyncTime(timeStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timeStr);
  } catch (e) {
    console.error('Failed to save last sync time', e);
  }
}

export function loadCachedEvents(): EconomicEvent[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCachedWatchlist(watchlist: WatchlistAsset[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  } catch (e) {
    console.error('Failed to cache watchlist', e);
  }
}

export function loadCachedWatchlist(): WatchlistAsset[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAlerts(alerts: PriceAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to cache alerts', e);
  }
}

export function loadAlerts(): PriceAlert[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getLastSyncTime(): string {
  try {
    const time = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (!time) return 'Just now';
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return 'Just now';
  }
}

export function getThemePreference(): 'dark' | 'light' {
  try {
    const pref = localStorage.getItem(STORAGE_KEYS.THEME);
    if (pref === 'light' || pref === 'dark') return pref;
    return 'dark'; // Default to sophisticated dark financial terminal theme
  } catch {
    return 'dark';
  }
}

export function setThemePreference(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // Ignore
  }
}

export function getAudioPref(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIO_ENABLED);
    return raw !== null ? raw === 'true' : true;
  } catch {
    return true;
  }
}

export function setAudioPref(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIO_ENABLED, String(enabled));
  } catch {
    // Ignore
  }
}
