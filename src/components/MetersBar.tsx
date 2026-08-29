import React from 'react';
import { Users, Flame, Landmark, Scale, AlertTriangle } from 'lucide-react';
import { Stats, StatKey } from '../types';
import { STAT_CONFIG } from '../data/endings';

interface MetersBarProps {
  stats: Stats;
  deltas?: Partial<Record<StatKey, number>> | null;
  hoverDeltas?: Partial<Record<StatKey, number>> | null;
}

export const MetersBar: React.FC<MetersBarProps> = ({ stats, deltas, hoverDeltas }) => {
  const getIcon = (key: StatKey) => {
    switch (key) {
      case 'pueblo':
        return <Users className="w-3.5 h-3.5" />;
      case 'caos':
        return <Flame className="w-3.5 h-3.5" />;
      case 'guita':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'instituciones':
        return <Scale className="w-3.5 h-3.5" />;
    }
  };

  const getMeterColor = (key: StatKey, value: number) => {
    if (value <= 15) return 'bg-[#A5333A]';
    if (value >= 85) return 'bg-[#A5333A]';
    if (value <= 30 || value >= 70) return 'bg-[#B9902E]';
    return 'bg-[#3C6E47]';
  };

  const keys: StatKey[] = ['pueblo', 'caos', 'guita', 'instituciones'];

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {keys.map((key) => {
          const val = stats[key];
          const info = STAT_CONFIG[key];
          const isDanger = val <= 18 || val >= 82;
          const delta = deltas ? deltas[key] : undefined;
          const hoverDelta = hoverDeltas ? hoverDeltas[key] : undefined;

          return (
            <div
              key={key}
              className={`relative bg-[#EDE6D3] text-[#24303A] border rounded p-2 sm:p-2.5 transition-all shadow-sm ${
                isDanger
                  ? 'border-[#A5333A] ring-2 ring-[#A5333A]/40 animate-[pulse_1.5s_infinite]'
                  : 'border-[#24303A]/20 hover:border-[#24303A]/40'
              }`}
              title={`${info.name}: ${info.description} (Valor: ${val}%)`}
            >
              {/* Header inside meter */}
              <div className="flex items-center justify-between text-[11px] font-mono mb-1 font-bold">
                <div className="flex items-center gap-1.5 text-[#24303A]">
                  <span className="text-[#3C6E47]">{getIcon(key)}</span>
                  <span className="uppercase tracking-wider">{info.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Subtle hover prediction indicator (Reigns-style) */}
                  {hoverDelta !== undefined && hoverDelta !== 0 && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full animate-ping ${
                        hoverDelta > 0 ? 'bg-[#3C6E47]' : 'bg-[#A5333A]'
                      }`}
                      title={hoverDelta > 0 ? 'Aumentará' : 'Disminuirá'}
                    />
                  )}
                  <span className={`text-xs ${isDanger ? 'text-[#A5333A] font-extrabold' : 'text-[#24303A]'}`}>
                    {val}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-2.5 bg-[#24303A]/15 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getMeterColor(
                    key,
                    val
                  )}`}
                  style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                />
              </div>

              {/* Floating Real-time Delta (+5 / -8) */}
              {delta !== undefined && delta !== 0 && (
                <div
                  className={`absolute -top-3 right-2 font-mono font-bold text-xs px-1.5 py-0.5 rounded shadow-md animate-[bounce_0.8s_ease-out] ${
                    delta > 0 ? 'bg-[#3C6E47] text-white' : 'bg-[#A5333A] text-white'
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </div>
              )}

              {/* Danger tooltip badge */}
              {isDanger && (
                <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-[#A5333A] font-bold truncate">
                  <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="truncate">{val <= 18 ? 'En el piso' : 'Por las nubes'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
