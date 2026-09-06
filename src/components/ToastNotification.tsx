import React from 'react';
import { ToastAlert } from '../utils/notifications';
import { ShieldAlert, Flame, Bell, X } from 'lucide-react';

interface ToastNotificationProps {
  toasts: ToastAlert[];
  onDismiss: (id: string) => void;
  isDark: boolean;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
  isDark,
}) => {
  if (toasts.length === 0) return null;

  return (
    <aside 
      aria-label="Real-time alerts and notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto p-3 rounded-[2px] border shadow-xl flex items-start gap-3 transition-all transform translate-y-0 duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'news'
              ? isDark 
                ? 'bg-[#121826] border-red-500/50 text-slate-100 shadow-red-500/10' 
                : 'bg-white border-red-400 text-slate-900 shadow-lg'
              : isDark
                ? 'bg-[#121826] border-cyan-500/50 text-slate-100 shadow-cyan-500/10'
                : 'bg-white border-cyan-400 text-slate-900 shadow-lg'
          }`}
        >
          <div className={`p-2 rounded-[2px] ${
            toast.type === 'news' 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-cyan-500/20 text-cyan-400'
          }`}>
            {toast.type === 'news' ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <Flame className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold font-mono tracking-tight text-amber-400">
                {toast.badge || 'MARKET ALERT'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {toast.timestamp}
              </span>
            </div>
            <h4 className="text-sm font-bold tracking-tight mt-0.5">
              {toast.title}
            </h4>
            <p className={`text-xs mt-1 leading-snug ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-200 transition cursor-pointer p-0.5"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </aside>
  );
};
