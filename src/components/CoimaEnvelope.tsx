import React from 'react';
import { Briefcase, AlertOctagon, Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface CoimaEnvelopeProps {
  coima: {
    montoDolares: number;
    descripcion: string;
    remitente: string;
    riesgoAllanamientos: number;
  };
  accepted: boolean;
  onToggle: (accept: boolean) => void;
}

export const CoimaEnvelope: React.FC<CoimaEnvelopeProps> = ({
  coima,
  accepted,
  onToggle
}) => {
  const handleToggle = () => {
    sound.playCash();
    onToggle(!accepted);
  };

  return (
    <div
      onClick={handleToggle}
      id="sobre-marron-coima"
      className={`relative cursor-pointer transition-all duration-300 p-3 sm:p-4 rounded-lg border-2 mb-5 select-none ${
        accepted
          ? 'bg-[#2A2315] border-[#E5C158] shadow-[0_4px_20px_rgba(229,193,88,0.25)] scale-[1.01]'
          : 'bg-[#1E1A16] border-[#8C6D3F]/40 hover:border-[#E5C158]/70 hover:bg-[#251F1A]'
      }`}
    >
      {/* Visual envelope flap effect */}
      <div className="absolute -top-2.5 right-4 bg-[#8C6D3F] text-[#1E1A16] px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
        <Briefcase className="w-3 h-3" />
        <span>SOBRE MARRÓN CONFIDENCIAL</span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border ${
              accepted
                ? 'bg-[#E5C158] text-black border-[#FFEAA7]'
                : 'bg-[#15120F] border-[#8C6D3F]/50 text-[#E5C158]'
            }`}
          >
            💵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Courier_Prime',monospace] font-bold text-sm sm:text-base text-[#FFEAA7]">
                + US$ {coima.montoDolares.toLocaleString('es-AR')} en efectivo
              </span>
              <span className="text-[10px] font-mono bg-red-950/80 text-red-300 px-1.5 py-0.5 rounded border border-red-800/40">
                +{coima.riesgoAllanamientos}% Riesgo Judicial
              </span>
            </div>
            <p className="font-serif italic text-xs text-[#EDE6D3]/90 mt-0.5">
              "{coima.descripcion}"
            </p>
            <div className="text-[10px] font-mono text-[#8B98A5] mt-1">
              Remitente anónimo atribuido a: <strong className="text-[#EDE6D3]">{coima.remitente}</strong>
            </div>
          </div>
        </div>

        {/* Toggle checkbox badge */}
        <div className="flex flex-col items-end flex-shrink-0">
          <button
            type="button"
            className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              accepted
                ? 'bg-[#E5C158] text-black shadow-sm'
                : 'bg-[#2E2822] text-[#EDE6D3] hover:bg-[#3D352D]'
            }`}
          >
            {accepted ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>ACEPTAR COIMA</span>
              </>
            ) : (
              <span>RECHAZAR SOBRE</span>
            )}
          </button>
          <span className="text-[9px] font-mono text-[#8B98A5] mt-1">
            {accepted ? 'Se suma a tu cuenta personal' : 'Hacé clic para guardártelo'}
          </span>
        </div>
      </div>
    </div>
  );
};
