import React from 'react';
import { Ending, Stats, DecisionRecord, StatKey } from '../types';
import { STAT_CONFIG } from '../data/endings';
import { RefreshCw, History, Award, Share2, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface EndingScreenProps {
  ending: Ending;
  stats: Stats;
  decisionCount: number;
  mateCount: number;
  onRestart: () => void;
  onOpenHistory: () => void;
  onOpenEndings: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  ending,
  stats,
  decisionCount,
  mateCount,
  onRestart,
  onOpenHistory,
  onOpenEndings
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    const text = `🇦🇷 En "EL SELLO - Ministerio de Trámites Varios" terminé como: ${ending.title} tras firmar ${decisionCount} expedientes y cebar ${mateCount} mates. ¿Podés gobernar mejor este país?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto select-none animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-[#EDE6D3] text-[#24303A] border-4 border-[#24303A] rounded-xl p-6 sm:p-9 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Top official banner */}
        <div className="text-[11px] font-mono font-bold tracking-[0.3em] uppercase text-[#7C2226] mb-2">
          Fin de Mandato · Resolución Histórica
        </div>

        {/* Final Big Rubber Stamp */}
        <div className="my-3 px-6 py-2.5 border-4 border-[#A5333A] text-[#A5333A] rounded font-['Courier_Prime',monospace] font-black text-xl sm:text-2xl uppercase tracking-widest rotate-[-3deg] shadow-md bg-[#A5333A]/10">
          {ending.stamp}
        </div>

        {/* Ending Title */}
        <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#10171d] mt-2 mb-1 uppercase tracking-tight text-balance">
          {ending.title}
        </h2>
        <div className="text-sm font-mono text-[#8B98A5] uppercase tracking-wider mb-4">
          {ending.subtitle}
        </div>

        {/* Narrative Description */}
        <div className="bg-[#F7F2E5] border border-[#24303A]/20 rounded-lg p-4 sm:p-5 my-3 text-sm sm:text-base font-serif leading-relaxed text-[#24303A] italic border-l-4 border-[#A5333A] text-left">
          "{ending.description}"
        </div>

        {/* Street Quote */}
        {ending.quote && (
          <div className="text-xs font-mono text-[#4B5A63] bg-[#E0D7BE]/60 p-2.5 rounded border border-[#24303A]/10 my-2 w-full">
            {ending.quote}
          </div>
        )}

        {/* Final Administration Stats */}
        <div className="w-full my-5 pt-4 border-t border-[#24303A]/20">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#B9902E] font-bold mb-3">
            Balance Final de la Gestión:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-[#F7F2E5] p-2.5 rounded border border-[#24303A]/15 flex flex-col">
              <span className="text-[#8B98A5] text-[10px] uppercase">Expedientes</span>
              <span className="font-bold text-base text-[#10171d]">{decisionCount}</span>
            </div>
            <div className="bg-[#F7F2E5] p-2.5 rounded border border-[#24303A]/15 flex flex-col">
              <span className="text-[#8B98A5] text-[10px] uppercase">Mates Cebados</span>
              <span className="font-bold text-base text-[#3C6E47]">{mateCount}</span>
            </div>
            {(['pueblo', 'caos', 'guita', 'instituciones'] as StatKey[]).map((k) => (
              <div
                key={k}
                className="bg-[#F7F2E5] p-2.5 rounded border border-[#24303A]/15 flex flex-col"
              >
                <span className="text-[#8B98A5] text-[10px] uppercase">{STAT_CONFIG[k].name}</span>
                <span className="font-bold text-base text-[#24303A]">{stats[k]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-3">
          <button
            onClick={() => {
              sound.playPageTurn();
              onRestart();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded bg-[#3C6E47] hover:bg-[#2F5938] text-white font-['Courier_Prime',monospace] font-bold text-sm uppercase tracking-wider shadow-[0_4px_0_#1E3B24] active:translate-y-1 active:shadow-none transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>NUEVA GESTIÓN</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenHistory();
            }}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded bg-[#24303A] hover:bg-[#10171d] text-[#EDE6D3] font-mono text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <History className="w-4 h-4 text-[#6CACE4]" />
            <span>Ver Legajo</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenEndings();
            }}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded bg-[#24303A] hover:bg-[#10171d] text-[#EDE6D3] font-mono text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#B9902E]" />
            <span>Finales</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded bg-[#E0D7BE] hover:bg-[#d5cbaf] text-[#24303A] font-mono text-xs uppercase tracking-wider border border-[#24303A]/20 transition cursor-pointer"
            title="Copiar resultado para compartir"
          >
            {copied ? <Check className="w-4 h-4 text-[#3C6E47]" /> : <Share2 className="w-4 h-4" />}
            <span className="sm:hidden md:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
