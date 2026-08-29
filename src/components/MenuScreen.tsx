import React from 'react';
import { Play, RotateCcw, Trash2, Award, History, Coffee, ShieldAlert, Sparkles, Radio, Tv } from 'lucide-react';
import { sound } from '../utils/sound';
import { radio } from '../utils/radio';

interface MenuScreenProps {
  hasSavedGame: boolean;
  savedDecisionCount: number;
  unlockedEndingsCount: number;
  totalEndingsCount: number;
  puntosGestion: number;
  onContinue: () => void;
  onNewGame: () => void;
  onDeleteSave: () => void;
  onOpenEndings: () => void;
  onOpenRadio: () => void;
  onOpenTv: () => void;
  onOpenStore: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  hasSavedGame,
  savedDecisionCount,
  unlockedEndingsCount,
  totalEndingsCount,
  puntosGestion,
  onContinue,
  onNewGame,
  onDeleteSave,
  onOpenEndings,
  onOpenRadio,
  onOpenTv,
  onOpenStore
}) => {
  const isRadioPlaying = radio.getIsPlaying();

  return (
    <div className="w-full max-w-xl mx-auto select-none animate-[fadeIn_0.4s_ease-out]">
      <div className="bg-[#EDE6D3] text-[#24303A] border-4 border-[#24303A] rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Presidential Escudo / Sol */}
        <div className="relative mb-3">
          <svg
            className="w-16 h-16 text-[#B9902E] filter drop-shadow-[0_4px_8px_rgba(185,144,46,0.4)]"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <circle cx="50" cy="50" r="22" />
            {[...Array(16)].map((_, i) => (
              <rect
                key={i}
                x="48"
                y="2"
                width="4"
                height="18"
                rx="2"
                transform={`rotate(${i * 22.5} 50 50)`}
              />
            ))}
          </svg>
        </div>

        <div className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-[#7C2226] mb-1">
          Presidencia de la Nación · Poder Ejecutivo
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Courier_Prime',monospace] tracking-wider text-[#10171d] mb-1">
          EL SELLO
        </h2>
        <div className="text-sm font-serif italic text-[#4B5A63] mb-4">
          Ministerio de Trámites Varios · Vos decidís. El país aguanta lo que puede.
        </div>

        {/* Narrative Intro */}
        <div className="bg-[#F7F2E5] border border-[#24303A]/20 rounded-lg p-4 mb-5 text-sm font-serif text-[#24303A] leading-relaxed text-left border-l-4 border-[#B9902E]">
          <p className="mb-2">
            Sos la máxima autoridad del despacho ministerial. A tu escritorio llegan los expedientes más insólitos de la idiosincrasia argentina: desde autorizaciones de murgas dominicales y congelamiento del precio del fernet, hasta drones de empanadas y pedidos de feriado por la Scaloneta.
          </p>
          <p className="text-xs text-[#7C2226] font-mono font-bold">
            Tu objetivo: Equilibrar el Pueblo, el Caos en la calle, las Arcas fiscales y las Instituciones para no ser destituido antes del próximo cacerolazo.
          </p>
        </div>

        {/* Saved Game Banner */}
        {hasSavedGame && (
          <div className="w-full bg-[#E0D7BE] border border-[#B9902E] rounded p-2.5 mb-4 text-xs font-mono text-[#24303A] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#3C6E47] animate-ping"></span>
              Gestión guardada activa · Exp. #{1000 + savedDecisionCount}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onDeleteSave();
              }}
              title="Borrar partida guardada"
              className="text-[#A5333A] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Borrar
            </button>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="w-full space-y-3">
          {hasSavedGame && (
            <button
              onClick={() => {
                sound.playPageTurn();
                onContinue();
              }}
              className="w-full py-3.5 px-6 rounded bg-[#3C6E47] hover:bg-[#2F5938] text-white font-['Courier_Prime',monospace] font-bold text-base uppercase tracking-wider shadow-[0_4px_0_#1E3B24] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 cursor-pointer border border-[#2A4E33]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>CONTINUAR GESTIÓN</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playPageTurn();
              onNewGame();
            }}
            className={`w-full py-3.5 px-6 rounded font-['Courier_Prime',monospace] font-bold text-base uppercase tracking-wider shadow-[0_4px_0_#10171d] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 cursor-pointer border ${
              hasSavedGame
                ? 'bg-[#24303A] hover:bg-[#10171d] text-[#EDE6D3] border-[#10171d]'
                : 'bg-[#3C6E47] hover:bg-[#2F5938] text-white border-[#2A4E33] shadow-[0_4px_0_#1E3B24]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{hasSavedGame ? 'EMPEZAR NUEVA GESTIÓN' : 'ASUMIR EL CARGO Y FIRMAR'}</span>
          </button>

          {/* TV CRT Button (Highly visible) */}
          <button
            onClick={() => {
              sound.playTvStinger();
              onOpenTv();
            }}
            className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-[#9E1B22] via-[#C0151D] to-[#9E1B22] hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider border-2 border-[#FFE600] transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 font-bold"
          >
            <Tv className="w-4 h-4 text-[#FFE600]" />
            <span>TRANSMISIÓN TELEVISIVA CRT (PLACA ROJA & NOTICIAS)</span>
          </button>

          {/* Economato / Tienda de Personalización */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenStore();
            }}
            className="w-full py-2.5 px-4 rounded bg-[#2B2317] hover:bg-[#3D3220] text-[#FFEAA7] font-mono text-xs uppercase tracking-wider border-2 border-[#B9902E] transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 font-bold"
          >
            <span>🏬</span>
            <span>ECONOMATO DEL ESTADO · PERSONALIZAR HUD ({puntosGestion} PTS)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenRadio();
              }}
              className={`py-2.5 px-3 rounded font-mono text-xs uppercase tracking-wider border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isRadioPlaying
                  ? 'bg-[#5E422C] hover:bg-[#735237] text-white border-[#B9902E]'
                  : 'bg-[#E0D7BE] hover:bg-[#d4c9ad] text-[#24303A] border-[#24303A]/20'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isRadioPlaying ? 'text-[#B9902E] animate-pulse' : 'text-[#5E422C]'}`} />
              <span>Radio Despacho</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenEndings();
              }}
              className="py-2.5 px-3 rounded bg-[#E0D7BE] hover:bg-[#d4c9ad] text-[#24303A] font-mono text-xs uppercase tracking-wider border border-[#24303A]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#B9902E]" />
              <span>Finales ({unlockedEndingsCount}/{totalEndingsCount})</span>
            </button>
          </div>
        </div>

        {/* Footer notes */}
        <div className="mt-5 text-[11px] font-mono text-[#8B98A5] flex items-center justify-center gap-2">
          <span>50+ expedientes únicos</span>
          <span>·</span>
          <span>10 finales de la república</span>
          <span>·</span>
          <span>TV Noticiero & Radio</span>
        </div>
      </div>
    </div>
  );
};

