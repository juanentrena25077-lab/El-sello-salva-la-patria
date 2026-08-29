import React from 'react';
import { Souvenir } from '../types';
import { SOUVENIRS } from '../data/extras';
import { Award, X, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { sound } from '../utils/sound';

interface SouvenirsModalProps {
  unlockedSouvenirs: string[];
  patrimonioDolares: number;
  allanamientoRiesgo: number;
  onOpenTruco: () => void;
  onClose: () => void;
}

export const SouvenirsModal: React.FC<SouvenirsModalProps> = ({
  unlockedSouvenirs,
  patrimonioDolares,
  allanamientoRiesgo,
  onOpenTruco,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        id="vitrina-souvenirs-dialog"
        className="w-full max-w-2xl bg-[#1C2024] text-[#EDE6D3] border-2 border-[#B9902E]/60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#B9902E]/20 border-b border-[#B9902E]/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#B9902E]/30 text-[#E5C158]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Courier_Prime',monospace] font-bold text-base sm:text-lg text-white">
                VITRINA & PATRIMONIO DEL MINISTRO
              </h2>
              <p className="font-mono text-xs text-[#8B98A5]">
                Colección de reliquias oficiales, recuerdos y cuentas personales
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#24303A] hover:bg-[#324352] text-[#8B98A5] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ministerial Wealth Status Bar */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-[#14171A] border-b border-[#24303A]">
          <div className="bg-[#1C241E] border border-[#3C6E47]/40 rounded-lg p-3">
            <div className="font-mono text-[11px] text-[#55A566] uppercase font-bold">
              💼 Cuenta Personal (Islas Caimán / Cajas):
            </div>
            <div className="font-mono text-xl font-bold text-emerald-400">
              US$ {patrimonioDolares.toLocaleString('es-AR')}
            </div>
            <div className="text-[10px] text-[#8B98A5] mt-0.5">
              {patrimonioDolares > 0
                ? 'Generado mediante favores y sobres marrones'
                : 'Patrimonio 100% en blanco y austero'}
            </div>
          </div>

          <div className="bg-[#261A1C] border border-[#A5333A]/40 rounded-lg p-3">
            <div className="font-mono text-[11px] text-red-400 uppercase font-bold">
              ⚖️ Riesgo de Allanamiento Federal:
            </div>
            <div className="font-mono text-xl font-bold text-red-300">
              {allanamientoRiesgo}%
            </div>
            <div className="w-full bg-red-950 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, allanamientoRiesgo)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Souvenirs Showcase Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8B98A5] mb-2">
            <span>OBJETOS DECORATIVOS DESBLOQUEADOS</span>
            <span>{unlockedSouvenirs.length} de {SOUVENIRS.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOUVENIRS.map((souvenir) => {
              const isUnlocked = unlockedSouvenirs.includes(souvenir.id);
              return (
                <div
                  key={souvenir.id}
                  className={`p-3.5 rounded-lg border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-[#242A30] border-[#B9902E]/40 text-white shadow-md'
                      : 'bg-[#15181B] border-[#24303A]/60 opacity-60 text-[#8B98A5]'
                  }`}
                >
                  <div className="text-3xl flex-shrink-0 bg-[#121517] w-12 h-12 rounded-lg flex items-center justify-center border border-white/5">
                    {souvenir.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm leading-tight text-[#EDE6D3]">
                        {souvenir.name}
                      </h4>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#55A566] flex-shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#8B98A5] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#8B98A5] mt-1 line-clamp-2">
                      {souvenir.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-[#B9902E]">
                      {isUnlocked ? '✓ Exhibido en despacho' : `Desbloqueo: ${souvenir.howToUnlock}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Truco challenge */}
        <div className="p-3 bg-[#14171A] border-t border-[#24303A] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#8B98A5]">
          <span>Los objetos decoran tu despacho y suman prestigio a tu foja.</span>
          <button
            onClick={() => {
              sound.playCardSlap();
              onOpenTruco();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1b3d24] hover:bg-[#285c36] text-[#FFEAA7] border border-[#B9902E]/60 font-bold transition cursor-pointer active:scale-95 shadow-md"
          >
            <span>🃏</span>
            <span>JUGAR TRUQUITO CON GARRAMUÑO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
