import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, CheckCircle, Flame, Coffee, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface IntroSuperiorModalProps {
  onFinish: () => void;
}

interface DialogStep {
  title: string;
  tagline: string;
  speech: string;
  advice: string;
  mood: string;
  icon: string;
}

const DIALOG_STEPS: DialogStep[] = [
  {
    title: 'EL BAUTISMO DEL SELLO',
    tagline: 'Despacho del Subsecretario · 07:45 AM',
    speech:
      'Cerrá la puerta y sentate, che. Mirame a los ojos porque esto no te lo enseñan en ninguna facultad de leyes ni en los cursos de recursos humanos. Acabás de agarrar la silla más caliente de Balcarce 50.',
    advice: '«El que duda en la mesa de entradas, termina declarando en Comodoro Py con un bolsito.»',
    mood: '☕ Acomoda el cenicero y ceba un mate amargo con agua hirviendo.',
    icon: '🏛️'
  },
  {
    title: 'LA MECÁNICA DEL ESTADO',
    tagline: 'El Poder del Sello de Madera',
    speech:
      'Acá no gobernamos con discursos para la tribuna: gobernamos con ESTE PEDAZO DE MADERA Y TINTA. A la derecha (o flecha derecha) APROBÁS el trámite. A la izquierda (o flecha izquierda) lo MANDÁS A ARCHIVAR. Un golpe de muñeca tuyo y le giraste millones al club de barrio o le clavaste un impuesto retroactivo a los sándwiches de miga.',
    advice: '«Cada firma tuya mueve jueces, gremios, piqueteros y cotizaciones del blue.»',
    mood: '🪵 Te golpea el sello contra el escritorio haciendo temblar las carpetas.',
    icon: '📑'
  },
  {
    title: 'EL EQUILIBRIO EN LA MAROMA',
    tagline: 'Los 4 Relojes de la República',
    speech:
      'Mirá bien los cuatro indicadores de arriba: El Pueblo, El Caos, Las Arcas y Las Instituciones. La regla es simple: si alguno toca CERO o CIEN, se pudre la momia y te vas en helicóptero por el techo. Ni muy santo ni muy tirano: acá se sobrevive con cintura política.',
    advice: '«El secreto del buen burócrata no es solucionar los problemas... es repartir la culpa con elegancia.»',
    mood: '📊 Apunta con una birome mordida a la pizarra de estadísticas.',
    icon: '⚖️'
  },
  {
    title: 'LAS REGLAS NO ESCRITAS',
    tagline: 'Sobres, Teléfono Rojo y Truco',
    speech:
      'Si algún expediente viene con un sobre marrón con verdes, evalualo: te llena la cuenta afuera pero te sube el olor a allanamiento. Si suena el Teléfono Rojo a disco, atendé que puede ser el Presidente. Y si la presión te quema la cabeza, cebate un mate o vení a mi oficina que nos jugamos una manito de Truco. ¿Estamos listos?',
    advice: '«Agarrá la almohadilla de tinta, pibe. Que Dios y el gremio no te demanden.»',
    mood: '🚬 Te guiña el ojo y te entrega la llave del cajón ministerial.',
    icon: '🎖️'
  }
];

export const IntroSuperiorModal: React.FC<IntroSuperiorModalProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const step = DIALOG_STEPS[currentStep];
  const isLast = currentStep === DIALOG_STEPS.length - 1;

  const handleNext = () => {
    sound.playPageTurn();
    if (isLast) {
      sound.playStamp(true);
      onFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    sound.playStamp(true);
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-300">
      <div
        id="charla-superior-dialog"
        className="w-full max-w-xl bg-[#1c1815] text-[#EDE6D3] border-4 border-[#B9902E] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative"
      >
        {/* Top Header Banner */}
        <div className="bg-[#B9902E] px-4 py-3 text-black font-['Courier_Prime',monospace] font-bold flex items-center justify-between border-b-2 border-[#8C6D23]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <div className="text-xs uppercase tracking-wider font-extrabold">
              INDUCCIÓN OFICIAL · DR. ANSELMO "EL ZORRO" GARRAMUÑO
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-[11px] font-mono text-black/70 hover:text-black hover:underline cursor-pointer"
          >
            [Saltar charla]
          </button>
        </div>

        {/* Character Card / Setting */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 bg-[#28211b] p-3 rounded-lg border border-[#B9902E]/30">
            <div className="w-14 h-14 rounded-full bg-[#171310] border-2 border-[#B9902E] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
              🕵️‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-white">
                  Dr. Anselmo Garramuño
                </span>
                <span className="text-[10px] bg-[#B9902E]/20 text-[#E5C158] px-2 py-0.5 rounded font-mono border border-[#B9902E]/40 font-bold">
                  38 años en Planta Permanente
                </span>
              </div>
              <p className="text-xs text-[#8B98A5] font-mono">
                Subsecretario Vitalicio de Coordinación de Firmas y Tramitaciones
              </p>
            </div>
          </div>

          {/* Stepper Progress bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8B98A5] px-1">
            <span className="text-[#E5C158] font-bold uppercase">{step.title}</span>
            <span>Paso {currentStep + 1} de {DIALOG_STEPS.length}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
            {DIALOG_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-full transition-all duration-300 ${
                  i <= currentStep ? 'bg-[#E5C158]' : 'bg-[#3A3025]'
                }`}
              />
            ))}
          </div>

          {/* Speech Dialogue Box */}
          <div className="bg-[#241d18] border-l-4 border-[#B9902E] p-4 rounded-r-lg shadow-inner min-h-[140px] flex flex-col justify-between">
            <p className="font-serif italic text-sm sm:text-base text-[#EDE6D3] leading-relaxed">
              «{step.speech}»
            </p>
            <div className="mt-3 pt-2 border-t border-[#3a3025] flex items-center gap-2 text-xs font-mono text-[#E5C158]">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{step.advice}</span>
            </div>
          </div>

          {/* Environmental note */}
          <div className="text-[11px] font-mono text-[#8B98A5] italic bg-[#15120f] p-2 rounded border border-white/5 flex items-center gap-2">
            <span>🚬</span>
            <span>{step.mood}</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {currentStep > 0 ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentStep((p) => p - 1);
                }}
                className="px-3 py-2 rounded bg-[#2A221C] hover:bg-[#3D3027] text-[#C2B29D] font-mono text-xs font-bold border border-white/10 transition cursor-pointer"
              >
                Anterior
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-5 py-2.5 rounded font-['Courier_Prime',monospace] font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
                isLast
                  ? 'bg-[#3C6E47] hover:bg-[#2F5837] text-white border-2 border-[#55A566] shadow-[0_0_20px_rgba(60,110,71,0.5)]'
                  : 'bg-[#B9902E] hover:bg-[#A37D24] text-black border border-[#FFEAA7]'
              }`}
            >
              <span>{isLast ? '¡DEME EL SELLO Y QUE SEA LO QUE DIOS QUIERA!' : 'Siguiente'}</span>
              {isLast ? <CheckCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
