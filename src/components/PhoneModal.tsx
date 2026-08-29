import React, { useState } from 'react';
import { PhoneCall } from '../types';
import { Phone, PhoneOff, UserCheck, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/sound';

interface PhoneModalProps {
  phoneCall: PhoneCall;
  onAnswer: (optionIndex: number) => void;
  onIgnore: () => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  phoneCall,
  onAnswer,
  onIgnore
}) => {
  const [answered, setAnswered] = useState(false);

  const handlePickUp = () => {
    sound.playPhonePickup();
    setAnswered(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        id="red-phone-dialog"
        className="w-full max-w-lg bg-[#241a1a] text-[#EDE6D3] border-4 border-[#A5333A] rounded-xl shadow-[0_20px_50px_rgba(165,51,58,0.4)] overflow-hidden flex flex-col"
      >
        {/* Vintage Red Header */}
        <div className="bg-[#A5333A] px-4 py-3 text-[#EDE6D3] flex items-center justify-between border-b-2 border-[#7C2226]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
            <Phone className="w-5 h-5 animate-bounce" />
            <span className="font-['Courier_Prime',monospace] font-bold text-sm tracking-wider uppercase">
              LÍNEA DIRECTA DE EMERGENCIA (TELÉFONO ROJO)
            </span>
          </div>
        </div>

        {/* Incoming state vs Call in progress */}
        {!answered ? (
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#A5333A]/20 border-2 border-[#A5333A] flex items-center justify-center text-4xl mb-4 animate-pulse">
              ☎️
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-red-300 mb-1">
              ¡EL TELÉFONO ROJO ESTÁ SONANDO!
            </h3>
            <p className="font-mono text-xs text-[#8B98A5] mb-4">
              Llamada entrante prioritaria desde Casa Rosada / Organismos Centrales
            </p>

            <div className="bg-[#181111] border border-[#A5333A]/40 rounded-lg p-3 w-full mb-6">
              <div className="font-mono text-xs text-[#B9902E] font-bold uppercase">Interlocutor:</div>
              <div className="font-serif text-lg text-white font-bold">{phoneCall.callerName}</div>
              <div className="font-mono text-xs text-[#8B98A5]">{phoneCall.callerTitle}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={onIgnore}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded bg-[#3A2424] hover:bg-[#4D2E2E] text-[#D3B4B4] font-mono text-xs font-bold border border-red-900/60 transition cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>NO ATENDER</span>
              </button>
              <button
                onClick={handlePickUp}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded bg-[#A5333A] hover:bg-[#8B2329] text-white font-['Courier_Prime',monospace] text-sm font-bold shadow-[0_4px_0_#62181C] active:translate-y-1 active:shadow-none transition cursor-pointer border border-[#7C2226]"
              >
                <Phone className="w-4 h-4 animate-pulse" />
                <span>LEVANTAR TUBO</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 flex flex-col">
            {/* Caller profile */}
            <div className="flex items-center gap-3 bg-[#181111] p-3 rounded-lg border border-[#A5333A]/30 mb-4">
              <div className="text-3xl">{phoneCall.callerAvatar}</div>
              <div>
                <div className="font-serif text-base font-bold text-white leading-tight">
                  {phoneCall.callerName}
                </div>
                <div className="font-mono text-xs text-[#B9902E]">{phoneCall.callerTitle}</div>
              </div>
            </div>

            {/* Spoken dialogue */}
            <div className="bg-[#2D1D1D] border-l-4 border-[#A5333A] p-4 rounded text-sm sm:text-base font-serif italic text-[#EDE6D3] leading-relaxed mb-5 shadow-inner">
              "{phoneCall.dialogue}"
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              <div className="font-mono text-[11px] uppercase font-bold text-[#8B98A5] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B9902E]" />
                <span>Elegí tu respuesta al teléfono:</span>
              </div>
              {phoneCall.opciones.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onAnswer(idx)}
                  className="w-full text-left p-3.5 rounded bg-[#1C1414] hover:bg-[#2F1F1F] border border-[#A5333A]/40 hover:border-[#A5333A] text-xs sm:text-sm font-sans text-[#EDE6D3] transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-start gap-2">
                    <UserCheck className="w-4 h-4 text-[#B9902E] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="font-serif leading-snug">{opt.texto}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
