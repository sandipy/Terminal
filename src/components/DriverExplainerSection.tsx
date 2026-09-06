import React from 'react';
import { DRIVER_GUIDES } from '../data/forexFactoryData';
import { 
  Fish, 
  Building2, 
  BarChart3, 
  Activity, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';

interface DriverExplainerSectionProps {
  isDark: boolean;
}

export const DriverExplainerSection: React.FC<DriverExplainerSectionProps> = ({ isDark }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'whale':
        return <Fish className="w-5 h-5 text-purple-400" />;
      case 'institutional':
        return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'macro':
        return <BarChart3 className="w-5 h-5 text-amber-400" />;
      case 'noise':
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div id="driver-classification-matrix" className="space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          <h2 className="text-base font-bold tracking-tight">
            Market Driver Intelligence: Major Drivers vs. Minor Market Noise
          </h2>
        </div>
        <span className={`text-xs px-2.5 py-0.5 rounded font-mono ${
          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
        }`}>
          Institutional & Macro Flow Filter
        </span>
      </div>

      {/* 4-Column Responsive Matrix - Visible without dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {DRIVER_GUIDES.map((guide) => (
          <div
            key={guide.type}
            id={`guide-${guide.type}`}
            className={`rounded-xl border p-3.5 space-y-2.5 transition ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            {/* Guide Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${guide.badgeColor}`}>
                  {getIcon(guide.type)}
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-tight">
                    {guide.title}
                  </h3>
                  <span className={`text-[10px] uppercase font-semibold ${
                    guide.type === 'noise' ? 'text-slate-500' : 'text-emerald-400'
                  }`}>
                    {guide.reliabilityScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {guide.description}
            </p>

            {/* How to identify on tape & charts */}
            <div className={`pt-2 border-t text-[11px] space-y-1 ${
              isDark ? 'border-slate-800/80' : 'border-slate-100'
            }`}>
              <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                How to Spot on Charts:
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                {guide.howToIdentify.map((rule, idx) => (
                  <li key={idx} className="leading-tight text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typical Duration */}
            <div className={`pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                Duration:
              </span>
              <span className="font-semibold text-cyan-400">
                {guide.typicalDuration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
