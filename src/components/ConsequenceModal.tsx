import React, { useEffect } from 'react';
import { Expediente, StatKey } from '../types';
import { STAT_CONFIG } from '../data/endings';
import { ArrowRight, MessageSquare, Radio, Tv, CheckCircle, XCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface ConsequenceModalProps {
  expediente: Expediente;
  approved: boolean;
  onNext: () => void;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  expediente,
  approved,
  onNext
}) => {
  const text = approved ? expediente.ca : expediente.cr;
  const quote = approved ? expediente.cq : expediente.cq_r;
  const deltas = approved ? expediente.a : expediente.r;

  useEffect(() => {
    // Play fanfare if there was a major impact or placaRoja
    if (expediente.placaRoja || Math.abs(deltas.pueblo || 0) >= 8 || Math.abs(deltas.guita || 0) >= 8) {
      sound.playFanfare();
    }
  }, [expediente, deltas, approved]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        sound.playPageTurn();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext]);

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-[#22303C] text-[#EDE6D3] border-2 border-[#4B5A63] rounded-lg p-5 sm:p-7 shadow-[0_16px_32px_rgba(0,0,0,0.5)]">
        {/* Top Tag & Status */}
        <div className="flex items-center justify-between border-b border-[#EDE6D3]/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#B9902E] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#B9902E] font-bold">
              Consecuencia Inmediata del Dictamen
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-['Courier_Prime',monospace] font-bold text-xs uppercase tracking-wider ${
              approved
                ? 'bg-[#3C6E47] text-white shadow-[0_2px_4px_rgba(60,110,71,0.4)]'
                : 'bg-[#A5333A] text-white shadow-[0_2px_4px_rgba(165,51,58,0.4)]'
            }`}
          >
            {approved ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            <span>{approved ? 'AUTORIZADO' : 'RECHAZADO'}</span>
          </div>
        </div>

        {/* Expediente Caratula Reminder */}
        <div className="text-[11px] font-mono text-[#8B98A5] mb-2 uppercase">
          Expediente: <b className="text-[#EDE6D3]">{expediente.asunto}</b>
        </div>

        {/* Main Consequence Story */}
        <div className="text-base sm:text-lg font-serif text-[#F7F2E5] leading-relaxed my-4 bg-[#18232C] p-4 rounded border-l-4 border-[#6CACE4]">
          {text}
        </div>

        {/* Reaction Quote / Media Box (Audio de WhatsApp, TV o Tweet) */}
        {quote && (
          <div className="bg-[#10171D] border border-[#304455] rounded p-3 my-4 flex items-start gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#6CACE4] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-mono text-[#6CACE4] leading-snug">
              {quote}
            </div>
          </div>
        )}

        {/* Stat Changes Summary */}
        <div className="my-4 pt-3 border-t border-[#EDE6D3]/15">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#B9902E] mb-2 font-bold">
            Impacto en los Indicadores de la República:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['pueblo', 'caos', 'guita', 'instituciones'] as StatKey[]).map((key) => {
              const delta = deltas[key];
              const info = STAT_CONFIG[key];
              if (delta === undefined || delta === 0) {
                return (
                  <div
                    key={key}
                    className="bg-[#18232C]/60 text-[#8B98A5] text-[11px] font-mono p-1.5 rounded flex justify-between items-center"
                  >
                    <span>{info.name}</span>
                    <span>0</span>
                  </div>
                );
              }

              const isPositive = delta > 0;
              return (
                <div
                  key={key}
                  className={`text-[11px] font-mono font-bold p-1.5 rounded flex justify-between items-center ${
                    isPositive ? 'bg-[#3C6E47]/30 text-[#4ade80] border border-[#3C6E47]' : 'bg-[#A5333A]/30 text-[#f87171] border border-[#A5333A]'
                  }`}
                >
                  <span>{info.name}</span>
                  <span>{isPositive ? `+${delta}` : delta}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          <button
            id="btn-next-expediente"
            onClick={() => {
              sound.playPageTurn();
              onNext();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-[#6CACE4] hover:bg-[#529cdb] text-[#10171d] font-['Courier_Prime',monospace] font-bold text-base uppercase tracking-wider shadow-[0_4px_0_#3877af] active:translate-y-1 active:shadow-none transition cursor-pointer"
          >
            <span>SIGUIENTE EXPEDIENTE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 text-right text-[10px] font-mono text-[#8B98A5]">
          Podés presionar <kbd className="px-1 py-0.5 bg-[#18232C] rounded border border-[#304455] text-white">Espacio</kbd> o <kbd className="px-1 py-0.5 bg-[#18232C] rounded border border-[#304455] text-white">Enter</kbd>
        </div>
      </div>
    </div>
  );
};
