import React from 'react';
import { ENDINGS } from '../data/endings';
import { X, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface EndingsModalProps {
  unlockedEndings: string[];
  onClose: () => void;
}

export const EndingsModal: React.FC<EndingsModalProps> = ({ unlockedEndings, onClose }) => {
  const endingList = Object.values(ENDINGS);
  const unlockedCount = unlockedEndings.length;
  const totalCount = endingList.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#EDE6D3] text-[#24303A] border-2 border-[#24303A] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#24303A] text-[#EDE6D3] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#B9902E]" />
            <div>
              <h3 className="font-['Courier_Prime',monospace] font-bold text-lg leading-tight uppercase tracking-wider">
                Galería de Finales de la República
              </h3>
              <p className="text-xs text-[#8B98A5] font-mono">
                Colección de destinos patrios desbloqueados ({unlockedCount} de {totalCount})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-[#324352] text-[#EDE6D3] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Endings */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#EDE6D3]/80">
          {endingList.map((ending) => {
            const isUnlocked = unlockedEndings.includes(ending.id);

            return (
              <div
                key={ending.id}
                className={`border rounded p-3.5 flex flex-col justify-between transition ${
                  isUnlocked
                    ? 'bg-[#F7F2E5] border-[#B9902E] shadow-sm'
                    : 'bg-[#E0D7BE]/50 border-[#24303A]/20 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                        isUnlocked
                          ? 'bg-[#B9902E]/20 text-[#7C2226] border-[#B9902E]'
                          : 'bg-[#24303A]/15 text-[#4B5A63] border-transparent'
                      }`}
                    >
                      {isUnlocked ? ending.badge : 'Bloqueado'}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3C6E47]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#8B98A5]" />
                    )}
                  </div>

                  <h4 className="font-['Courier_Prime',monospace] font-bold text-sm text-[#10171d] leading-snug">
                    {isUnlocked ? ending.title : '??? · Destino Oculto'}
                  </h4>

                  <p className="text-xs font-serif text-[#24303A] mt-1 line-clamp-3">
                    {isUnlocked ? ending.description : 'Tomá decisiones extremas o equilibradas para descubrir este final.'}
                  </p>
                </div>

                {isUnlocked && (
                  <div className="mt-3 pt-2 border-t border-[#24303A]/10 text-[10px] font-mono text-[#7C2226] font-bold">
                    Sello: {ending.stamp}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#E0D7BE] p-3 border-t border-[#24303A]/20 flex justify-between items-center text-xs font-mono text-[#4B5A63]">
          <span>Gabinete de la Presidencia</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-[#24303A] text-[#EDE6D3] font-bold hover:bg-[#10171d] transition cursor-pointer"
          >
            Volver al Despacho
          </button>
        </div>
      </div>
    </div>
  );
};
