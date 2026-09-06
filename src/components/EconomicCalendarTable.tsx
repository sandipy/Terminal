import React, { useState } from 'react';
import { EconomicEvent, ImpactLevel } from '../types';
import { 
  Calendar, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  ExternalLink,
  Flame,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface EconomicCalendarTableProps {
  events: EconomicEvent[];
  isDark: boolean;
  onToggleEventAlert: (eventId: string) => void;
  onSimulateEventRelease?: (eventId: string) => void;
}

export const EconomicCalendarTable: React.FC<EconomicCalendarTableProps> = ({
  events,
  isDark,
  onToggleEventAlert,
  onSimulateEventRelease,
}) => {
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');

  const filteredEvents = events.filter((ev) => {
    if (impactFilter === 'high' && ev.impact !== 'high') return false;
    if (impactFilter === 'medium' && ev.impact === 'low') return false;
    if (currencyFilter !== 'all' && ev.currency !== currencyFilter) return false;
    return true;
  });

  const getImpactBadge = (impact: ImpactLevel) => {
    switch (impact) {
      case 'high':
        return (
          <span 
            className="flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-[2px] bg-red-500/20 text-red-500 border border-red-500/30 font-mono tracking-tight"
            title="High Impact News Event (Expected Volatility: 70-150 pips)"
          >
            <span className="h-2 w-2 rounded-[1px] bg-red-500 animate-pulse" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span 
            className="flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-[2px] bg-orange-500/15 text-orange-400 border border-orange-500/30 font-mono"
            title="Medium Impact News Event (Expected Volatility: 30-60 pips)"
          >
            <span className="h-2 w-2 rounded-[1px] bg-orange-400" />
            MED
          </span>
        );
      case 'low':
      default:
        return (
          <span 
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[2px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono"
            title="Low Impact News Event"
          >
            <span className="h-1.5 w-1.5 rounded-[1px] bg-yellow-400" />
            LOW
          </span>
        );
    }
  };

  const getDeviationBadge = (dev?: string) => {
    if (dev === 'beat') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <ArrowUpRight className="w-3 h-3" /> BEAT
        </span>
      );
    }
    if (dev === 'miss') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <ArrowDownRight className="w-3 h-3" /> MISS
        </span>
      );
    }
    if (dev === 'inline') {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-slate-700/40 text-slate-300">
          IN-LINE
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-slate-800 text-slate-400">
        PENDING
      </span>
    );
  };

  const availableCurrencies = ['all', 'USD', 'EUR', 'GBP', 'JPY', 'CAD'];

  return (
    <div id="economic-calendar-section" className="space-y-3">
      {/* Section Header & Visible Filter Bar (No hidden dropdowns!) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h2 className="text-base font-bold tracking-tight">
            Global Macro Economic Calendar Data
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded-[2px] font-mono ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            {filteredEvents.length} Events Listed
          </span>
        </div>

        {/* Visible Filter Controls - Clean inline pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Impact Filters */}
          <div className={`flex items-center p-0.5 rounded-[2px] border ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}>
            <span className="px-2 text-[11px] text-slate-500 font-sans font-semibold">Impact:</span>
            <button
              onClick={() => setImpactFilter('all')}
              className={`px-2 py-1 rounded-[2px] transition cursor-pointer ${
                impactFilter === 'all'
                  ? isDark ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-cyan-50 text-cyan-800 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setImpactFilter('high')}
              className={`px-2 py-1 rounded-[2px] transition cursor-pointer flex items-center gap-1 ${
                impactFilter === 'high'
                  ? 'bg-red-500/20 text-red-400 font-bold'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-[1px] bg-red-500" />
              High Only
            </button>
            <button
              onClick={() => setImpactFilter('medium')}
              className={`px-2 py-1 rounded-[2px] transition cursor-pointer ${
                impactFilter === 'medium'
                  ? 'bg-orange-500/20 text-orange-400 font-bold'
                  : 'text-slate-400 hover:text-orange-400'
              }`}
            >
              Med+
            </button>
          </div>

          {/* Currency Filters */}
          <div className={`flex items-center p-0.5 rounded-[2px] border ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
          }`}>
            <span className="px-2 text-[11px] text-slate-500 font-sans font-semibold">Currency:</span>
            {availableCurrencies.map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrencyFilter(curr)}
                className={`px-2 py-1 rounded-[2px] transition cursor-pointer uppercase ${
                  currencyFilter === curr
                    ? isDark ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'bg-cyan-50 text-cyan-800 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean, High-Contrast Scrollable Table */}
      <div className={`rounded-[2px] border overflow-hidden shadow-xs ${
        isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[920px]">
            <thead>
              <tr className={`border-b text-xs font-mono uppercase tracking-wider ${
                isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <th className="py-3 px-4 font-semibold w-28">Time / Date</th>
                <th className="py-3 px-3 font-semibold w-20">Currency</th>
                <th className="py-3 px-3 font-semibold w-24">Impact</th>
                <th className="py-3 px-4 font-semibold min-w-[200px]">Event Detail</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Actual</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Forecast</th>
                <th className="py-3 px-3 font-semibold text-center w-20">Previous</th>
                <th className="py-3 px-4 font-semibold min-w-[280px]">Market Reaction & Primary Driver</th>
                <th className="py-3 px-3 font-semibold text-center w-16">Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {filteredEvents.map((ev) => {
                const isReleased = ev.status === 'released';

                return (
                  <tr 
                    key={ev.id}
                    id={`calendar-row-${ev.id}`}
                    className={`transition-colors duration-150 ${
                      isDark 
                        ? 'hover:bg-slate-800/50' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Time / Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold">
                        {ev.time}
                      </div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {ev.date}
                      </div>
                    </td>

                    {/* Currency & Flag */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <span className="text-base" role="img" aria-label={ev.country}>
                          {ev.flag}
                        </span>
                        <span>{ev.currency}</span>
                      </div>
                    </td>

                    {/* Impact Level Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getImpactBadge(ev.impact)}
                    </td>

                    {/* Event Title & Surprise / Release State */}
                    <td className="py-3 px-4">
                      <div className="font-bold tracking-tight text-sm">
                        {ev.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getDeviationBadge(ev.deviation)}
                        {ev.surpriseDetail && (
                          <span className={`text-[11px] truncate max-w-[220px] ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {ev.surpriseDetail}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actual */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono font-extrabold text-sm">
                      {isReleased ? (
                        <span className={
                          ev.deviation === 'beat' 
                            ? 'text-emerald-400 font-bold' 
                            : ev.deviation === 'miss' 
                              ? 'text-rose-400 font-bold' 
                              : ''
                        }>
                          {ev.actual}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-xs font-normal">
                          Upcoming
                        </span>
                      )}
                    </td>

                    {/* Forecast */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-slate-400">
                      {ev.forecast}
                    </td>

                    {/* Previous */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-slate-500">
                      {ev.previous}
                    </td>

                    {/* Market Reaction & Primary Driver (Visible right in the row!) */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="font-bold text-cyan-400">
                            {ev.reaction.affectedAsset}:
                          </span>
                          <span className="font-semibold text-amber-300">
                            {ev.reaction.impactPipsOrPoints}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-snug line-clamp-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {ev.reaction.driverExplanation}
                        </p>
                      </div>
                    </td>

                    {/* Notification Alert Bell Toggle */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        id={`btn-event-alert-${ev.id}`}
                        onClick={() => onToggleEventAlert(ev.id)}
                        className={`p-1.5 rounded-[2px] border transition cursor-pointer ${
                          ev.alertSubscribed
                            ? isDark 
                              ? 'border-amber-500/40 bg-amber-500/20 text-amber-300' 
                              : 'border-amber-500/40 bg-amber-50 text-amber-700'
                            : isDark 
                              ? 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300' 
                              : 'border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700'
                        }`}
                        title={ev.alertSubscribed ? 'Subscribed to push alerts for this event' : 'Click to subscribe to push notification'}
                      >
                        {ev.alertSubscribed ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
