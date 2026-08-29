import React, { useState } from 'react';
import { X, Coffee, Sparkles, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';

interface MateModalProps {
  mateCount: number;
  onCebarMate: () => void;
  onClose: () => void;
}

const MATE_FRASES = [
  '¡Qué buen amargo, viejo! Con la montañita bien armada.',
  'Pará que la pava estaba a 95º y casi me quemo la lengua.',
  'Este mate tiene más espuma que el río de la Plata en pleamar.',
  'Unos mates y a seguir firmando decretos como Dios manda.',
  'Se te lavó la yerba, che. Dale la vuelta a la bombilla con cuidado.',
  'Mate sin azúcar, como manda la Constitución Nacional.',
  'El mate no se niega nunca, ni en medio de un golpe de Estado.',
  'Con este cimarrón aguantamos hasta el próximo paro de colectivos.',
  '¡Cuidado con mover la bombilla que se pudre todo en el ministerio!',
  'El verdadero combustible de la República Argentina.'
];

export const MateModal: React.FC<MateModalProps> = ({ mateCount, onCebarMate, onClose }) => {
  const [fraseIndex, setFraseIndex] = useState<number>(0);
  const [isSipping, setIsSipping] = useState<boolean>(false);

  const handleCebar = () => {
    sound.playMateSip();
    setIsSipping(true);
    onCebarMate();
    setFraseIndex((prev) => (prev + 1) % MATE_FRASES.length);
    setTimeout(() => {
      setIsSipping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md bg-[#EDE6D3] text-[#24303A] border-2 border-[#24303A] rounded-lg shadow-2xl overflow-hidden p-6 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 p-1.5 rounded hover:bg-[#E0D7BE] text-[#24303A] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1 text-[#3C6E47]">
          <Coffee className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            Pausa Oficial de Despacho
          </span>
        </div>
        <h3 className="font-['Courier_Prime',monospace] font-bold text-xl uppercase tracking-wider text-[#10171d] mb-4">
          El Mate del Ministro
        </h3>

        {/* Mate Illustration & Steam Animation */}
        <div className="relative my-4 flex flex-col items-center">
          {/* Steam ripples */}
          <div className="flex gap-1.5 mb-1 animate-bounce">
            <span className="w-1.5 h-4 bg-[#8B98A5]/50 rounded-full blur-[1px] animate-pulse"></span>
            <span className="w-1.5 h-6 bg-[#8B98A5]/60 rounded-full blur-[1px] animate-pulse delay-100"></span>
            <span className="w-1.5 h-4 bg-[#8B98A5]/50 rounded-full blur-[1px] animate-pulse delay-200"></span>
          </div>

          {/* Mate Calabaza SVG */}
          <div
            onClick={handleCebar}
            className={`w-28 h-28 rounded-full bg-gradient-to-b from-[#4a2e18] to-[#2b180a] border-4 border-[#B9902E] shadow-xl flex items-center justify-center cursor-pointer transition transform ${
              isSipping ? 'scale-90 rotate-[-5deg]' : 'hover:scale-105'
            }`}
          >
            {/* Yerba inside */}
            <div className="w-20 h-20 rounded-full bg-[#3d5a27] border-2 border-[#1c300f] relative overflow-hidden flex items-center justify-center">
              {/* Espuma */}
              <div className="absolute top-2 w-14 h-6 bg-[#6a8c3d] rounded-full opacity-60"></div>
              {/* Bombilla Alpaca */}
              <div className="absolute -top-6 right-3 w-3 h-16 bg-[#e0e0e0] border border-[#999] rounded-full rotate-[-25deg] shadow"></div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#8B98A5] mt-2">
            (Hacé click en el mate para cebar)
          </div>
        </div>

        {/* Phrase */}
        <div className="bg-[#F7F2E5] border border-[#24303A]/20 rounded-lg p-3 my-3 w-full font-serif italic text-sm text-[#24303A]">
          "{MATE_FRASES[fraseIndex]}"
        </div>

        {/* Counter */}
        <div className="font-mono text-xs text-[#4B5A63] mb-4">
          Mates cebados en esta gestión: <b className="text-[#3C6E47] text-sm">{mateCount}</b>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCebar}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded bg-[#3C6E47] hover:bg-[#2F5938] text-white font-['Courier_Prime',monospace] font-bold text-sm uppercase tracking-wider shadow-[0_4px_0_#1E3B24] active:translate-y-1 active:shadow-none transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#B9902E]" />
          <span>¡CEBAR OTRO AMARGO!</span>
        </button>
      </div>
    </div>
  );
};
