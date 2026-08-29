import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  RadioTower, 
  Flame, 
  Users, 
  Landmark, 
  Scale, 
  AlertCircle, 
  Sparkles,
  Radio,
  Eye
} from 'lucide-react';
import { DecisionRecord, StatKey } from '../types';
import { sound } from '../utils/sound';
import { STAT_CONFIG } from '../data/endings';

interface TvModalProps {
  history: DecisionRecord[];
  onClose: () => void;
}

type ChannelId = 'cronica' | 'tvp' | 'noticiero13' | 'canal24';

interface ChannelInfo {
  id: ChannelId;
  number: number;
  name: string;
  badge: string;
  tagline: string;
  themeColor: string;
}

const CHANNELS: ChannelInfo[] = [
  {
    id: 'cronica',
    number: 2,
    name: 'Canal 2 · Placas Rojas',
    badge: 'CRÓNICA TV',
    tagline: 'Firme junto al pueblo las 24 horas',
    themeColor: '#C0151D'
  },
  {
    id: 'tvp',
    number: 7,
    name: 'Canal 7 · TV Pública',
    badge: 'TV PÚBLICA',
    tagline: 'Cadena Nacional e Información Federal',
    themeColor: '#1E6091'
  },
  {
    id: 'noticiero13',
    number: 13,
    name: 'Canal 13 · El Noticiero',
    badge: 'NOTICIAS 13',
    tagline: 'Móvil en vivo desde el lugar de los hechos',
    themeColor: '#D97706'
  },
  {
    id: 'canal24',
    number: 24,
    name: 'Canal 24 · Minuto a Minuto',
    badge: '24 NOTICIAS',
    tagline: 'El termómetro social y económico del país',
    themeColor: '#7C3AED'
  }
];

const LOCATIONS = [
  'Móvil 1: Plaza de Mayo',
  'Móvil 2: Obelisco Porteño',
  'Móvil 3: Puente Pueyrredón',
  'Móvil 4: Estación Once',
  'Móvil 5: Congreso de la Nación',
  'Móvil 6: Puerta del Ministerio',
  'Móvil 7: Balvanera',
  'Móvil 8: Costanera Sur'
];

export const TvModal: React.FC<TvModalProps> = ({ history, onClose }) => {
  const [currentChannel, setCurrentChannel] = useState<ChannelId>('cronica');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isStatic, setIsStatic] = useState<boolean>(false);
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalDecisions = history.length;
  // History is newest first. We reverse if we want chronological order or let user browse
  const currentRecord = totalDecisions > 0 ? history[currentIndex] : null;
  const activeChannel = CHANNELS.find((c) => c.id === currentChannel) || CHANNELS[0];

  const triggerChannelZap = () => {
    sound.playTvSwitch();
    setIsStatic(true);
    setTimeout(() => setIsStatic(false), 220);
  };

  const handleNext = () => {
    if (totalDecisions <= 1) return;
    triggerChannelZap();
    setCurrentIndex((prev) => (prev + 1) % totalDecisions);
  };

  const handlePrev = () => {
    if (totalDecisions <= 1) return;
    triggerChannelZap();
    setCurrentIndex((prev) => (prev - 1 + totalDecisions) % totalDecisions);
  };

  const handleSelectChannel = (ch: ChannelId) => {
    if (ch === currentChannel) return;
    setCurrentChannel(ch);
    triggerChannelZap();
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && totalDecisions > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalDecisions);
        triggerChannelZap();
      }, 4500);
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, totalDecisions]);

  // Key navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [totalDecisions]);

  // Location based on index
  const locationText = LOCATIONS[currentIndex % LOCATIONS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-3xl bg-[#382215] border-4 border-[#23150D] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3 sm:p-5 flex flex-col items-center">
        {/* Antennas decoration */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-12 pointer-events-none">
          <div className="w-1.5 h-8 bg-gradient-to-t from-[#B9902E] to-[#E0D7BE] rounded-t -rotate-[24deg] shadow-md origin-bottom"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#B9902E] -mt-1 shadow-sm"></div>
          <div className="w-1.5 h-8 bg-gradient-to-t from-[#B9902E] to-[#E0D7BE] rounded-t rotate-[24deg] shadow-md origin-bottom"></div>
        </div>

        {/* Top Header of Cabinet */}
        <div className="w-full flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#52331F] text-[#EDE6D3]">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#B9902E]" />
            <div>
              <span className="font-['Courier_Prime',monospace] font-bold text-sm tracking-wider uppercase text-[#EDE6D3]">
                TELEVISIÓN MINISTERIAL CRT
              </span>
              <span className="text-[10px] font-mono text-[#B9902E] ml-2 hidden sm:inline">
                Norma PAL-N · Transmisión en Directo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTvStinger();
              }}
              title="Sonar placa roja urgente"
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#A5333A] hover:bg-[#8B2329] text-white font-mono text-[11px] font-bold cursor-pointer border border-[#E0D7BE]/30 active:scale-95 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fanfarria</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1 rounded bg-[#23150D] hover:bg-[#1A0F09] text-[#EDE6D3] cursor-pointer transition border border-[#52331F]"
              title="Cerrar televisión"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main TV Frame Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* CRT Screen (left/main) */}
          <div className="lg:col-span-9 relative bg-[#090C0E] border-4 border-[#1B110B] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between min-h-[360px] sm:min-h-[410px]">
            {/* Screen Glass Reflection & Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08)_0%,transparent_70%)] z-20"></div>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] z-20 rounded-2xl"></div>

            {/* Scanlines Effect */}
            {scanlinesActive && (
              <div 
                className="absolute inset-0 pointer-events-none z-20 opacity-25"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 3px, rgba(0, 0, 0, 0.8) 4px)',
                  backgroundSize: '100% 4px'
                }}
              ></div>
            )}

            {/* Static Noise Overlay when switching */}
            {isStatic && (
              <div className="absolute inset-0 bg-[#333] z-30 flex items-center justify-center animate-pulse">
                <div 
                  className="w-full h-full opacity-80"
                  style={{
                    backgroundImage: 'radial-gradient(#fff 15%, transparent 16%), radial-gradient(#fff 15%, transparent 16%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px'
                  }}
                ></div>
                <span className="absolute font-mono font-bold text-lg text-white bg-black/60 px-3 py-1 rounded tracking-widest uppercase">
                  SINTONIZANDO CANAL {activeChannel.number}...
                </span>
              </div>
            )}

            {/* Screen Content */}
            <div className="relative z-10 p-3 sm:p-4 flex flex-col justify-between h-full text-white">
              {/* Channel Header On-Screen */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-white/20 text-xs font-mono font-bold tracking-wider text-[#EDE6D3]">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="text-red-500 font-extrabold">VIVO</span>
                    <span className="text-white/60">|</span>
                    <span>{locationText}</span>
                  </span>
                </div>

                {/* Channel Watermark */}
                <div className="flex items-center gap-2">
                  <div 
                    className="px-2 py-1 rounded text-xs font-black tracking-widest uppercase shadow-md border border-white/20"
                    style={{ backgroundColor: activeChannel.themeColor }}
                  >
                    {activeChannel.badge}
                  </div>
                  <span className="font-mono text-xs font-bold text-white/70 bg-black/60 px-1.5 py-0.5 rounded">
                    CH {activeChannel.number}
                  </span>
                </div>
              </div>

              {/* Central Broadcast Message Area */}
              <div className="my-auto py-3">
                {currentRecord ? (
                  <div className="space-y-3">
                    {/* Crónica / News Style Red Plate */}
                    {currentChannel === 'cronica' && (
                      <div className="bg-[#B31218] border-2 border-white rounded-lg p-3 sm:p-4 text-center shadow-2xl animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-black text-[#FFE600] font-mono text-[10px] sm:text-xs font-extrabold uppercase tracking-widest py-0.5 px-2 inline-block mb-1.5 rounded">
                          ★ PLACA ROJA DE URGENCIA ★
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black font-mono uppercase tracking-tight text-white leading-tight drop-shadow-md">
                          {currentRecord.decision === 'aprobado'
                            ? `¡HABEMUS FIRMA! APROBARON EL EXPEDIENTE #${currentRecord.numero}`
                            : `¡RECHAZO ROTUNDO! FRENARON EL TRÁMITE #${currentRecord.numero}`}
                        </h3>
                        <p className="text-xs sm:text-sm font-serif italic text-white/95 mt-2 bg-black/30 p-2 rounded border border-white/20">
                          "{currentRecord.cita}"
                        </p>
                      </div>
                    )}

                    {/* TV Pública Style */}
                    {currentChannel === 'tvp' && (
                      <div className="bg-[#102C44]/90 border-2 border-[#6CACE4] rounded-lg p-3 sm:p-4 text-left shadow-2xl">
                        <div className="flex items-center gap-2 mb-1 text-[#6CACE4] text-xs font-mono font-bold uppercase">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B9902E]"></span>
                          <span>COMUNICADO OFICIAL · PODER EJECUTIVO NACIONAL</span>
                        </div>
                        <div className="text-sm sm:text-base font-serif text-[#EDE6D3] leading-snug">
                          {currentRecord.consecuencia}
                        </div>
                        <div className="mt-2 text-[11px] font-mono text-[#6CACE4] border-t border-[#6CACE4]/30 pt-1.5 flex justify-between items-center">
                          <span>EXP: {currentRecord.caratula}</span>
                          <span className="font-bold text-[#FFE600] uppercase">Dictamen: {currentRecord.decision}</span>
                        </div>
                      </div>
                    )}

                    {/* Canal 13 Noticiero Style */}
                    {currentChannel === 'noticiero13' && (
                      <div className="bg-[#1C1917]/90 border-2 border-[#D97706] rounded-lg p-3 sm:p-4 text-left shadow-2xl">
                        <div className="bg-[#D97706] text-black font-mono font-extrabold text-xs uppercase px-2 py-0.5 inline-block rounded mb-1">
                          ALERTA EN EL MÓVIL DE LA CALLE
                        </div>
                        <div className="text-base sm:text-lg font-bold font-sans text-white leading-tight mb-2">
                          {currentRecord.consecuencia}
                        </div>
                        <div className="bg-black/50 p-2 rounded text-xs italic text-[#FDE68A] font-serif border-l-2 border-[#D97706]">
                          Vecino en vivo: "{currentRecord.cita}"
                        </div>
                      </div>
                    )}

                    {/* Canal 24 Debate & Stats Style */}
                    {currentChannel === 'canal24' && (
                      <div className="bg-[#1A102F]/90 border-2 border-[#8B5CF6] rounded-lg p-3 sm:p-4 text-left shadow-2xl">
                        <div className="flex items-center justify-between text-xs font-mono text-[#C4B5FD] mb-2">
                          <span className="font-bold uppercase tracking-wider">BALANCE DEL IMPACTO MINISTERIAL</span>
                          <span className="bg-[#8B5CF6] text-white px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                            FOLIO #{currentRecord.numero}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-sans text-[#EDE6D3] mb-3">
                          {currentRecord.consecuencia}
                        </p>
                        {/* Stats mini meters */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                          {(['pueblo', 'caos', 'guita', 'instituciones'] as StatKey[]).map((k) => {
                            const delta = currentRecord.deltas[k] || 0;
                            const statCfg = STAT_CONFIG[k];
                            return (
                              <div key={k} className="bg-black/40 p-1.5 rounded flex items-center justify-between">
                                <span className="text-[#A78BFA] text-[10px] capitalize">{statCfg.shortName}:</span>
                                <span
                                  className={`font-bold text-[11px] ${
                                    delta > 0
                                      ? k === 'caos' ? 'text-red-400' : 'text-emerald-400'
                                      : delta < 0
                                      ? k === 'caos' ? 'text-emerald-400' : 'text-red-400'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '0'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Initial State Broadcast */
                  <div className="bg-[#B31218] border-2 border-white rounded-lg p-4 sm:p-6 text-center shadow-2xl animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-black text-[#FFE600] font-mono text-xs font-extrabold uppercase tracking-widest py-1 px-3 inline-block mb-2 rounded">
                      ★ TRANSMISIÓN ESPECIAL EN CADENA NACIONAL ★
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black font-mono uppercase tracking-tight text-white leading-tight">
                      ASUMIÓ EL NUEVO MINISTRO DE TRÁMITES VARIOS
                    </h3>
                    <p className="text-sm sm:text-base font-serif italic text-white/95 mt-3 bg-black/40 p-3 rounded border border-white/20">
                      "Hay expectativa total en Plaza de Mayo. Los expedientes se acumulan en el despacho y el país espera las primeras firmas de la gestión."
                    </p>
                    <div className="mt-3 text-xs font-mono text-[#FFE600] animate-pulse font-bold">
                      [Estampá el primer expediente para ver las consecuencias en vivo en esta pantalla]
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom News Ticker (Zócalo televisivo) */}
              <div className="w-full bg-black/90 border-t-2 border-white/30 p-2 rounded flex items-center gap-2 overflow-hidden shadow-2xl">
                <span 
                  className="text-white font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: activeChannel.themeColor }}
                >
                  URGENTE
                </span>
                <div className="text-xs font-mono text-[#FFE600] truncate font-bold">
                  {currentRecord 
                    ? `[NOTICIA #${currentIndex + 1}/${totalDecisions}] ${currentRecord.asunto} -> ${currentRecord.consecuencia}` 
                    : 'TRANSMISIÓN INAUGURAL: Las cámaras registran el primer mate cebado en el escritorio ministerial.'}
                </div>
              </div>
            </div>
          </div>

          {/* Right/Side TV Control Panel (vintage knobs & channels) */}
          <div className="lg:col-span-3 bg-[#24170E] border-2 border-[#160E08] rounded-2xl p-3 flex flex-col justify-between text-[#EDE6D3] shadow-lg">
            <div>
              <div className="text-center font-mono font-bold text-xs text-[#B9902E] uppercase tracking-wider mb-2 border-b border-[#52331F] pb-1.5">
                Sintonizador & Controles
              </div>

              {/* Channel Selector Buttons */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] font-mono text-[#8B98A5] uppercase tracking-wider mb-1">
                  Canales de Noticias:
                </div>
                {CHANNELS.map((ch) => {
                  const isSel = ch.id === currentChannel;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSelectChannel(ch.id)}
                      className={`w-full text-left p-2 rounded font-mono text-xs transition cursor-pointer border flex items-center justify-between ${
                        isSel
                          ? 'bg-[#5C3A21] text-white border-[#B9902E] shadow-sm font-bold'
                          : 'bg-[#180F09] hover:bg-[#2C1C11] text-[#EDE6D3]/80 border-[#3D2516]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: ch.themeColor }}
                        ></span>
                        <span className="truncate">{ch.badge}</span>
                      </div>
                      <span className="text-[10px] text-[#B9902E] font-bold">CH {ch.number}</span>
                    </button>
                  );
                })}
              </div>

              {/* Broadcast Navigation Controls */}
              {totalDecisions > 0 && (
                <div className="space-y-2 mb-3">
                  <div className="text-[10px] font-mono text-[#8B98A5] uppercase tracking-wider">
                    Rebobinar Noticias ({currentIndex + 1}/{totalDecisions}):
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={handlePrev}
                      disabled={totalDecisions <= 1}
                      title="Noticia anterior (Flecha Izq)"
                      className="p-2 rounded bg-[#180F09] hover:bg-[#2C1C11] disabled:opacity-40 text-[#EDE6D3] flex items-center justify-center cursor-pointer border border-[#3D2516]"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsPlaying((p) => !p);
                      }}
                      title={isPlaying ? 'Pausar transmisión' : 'Reproducción automática'}
                      className={`p-2 rounded flex items-center justify-center cursor-pointer border transition ${
                        isPlaying
                          ? 'bg-[#A5333A] text-white border-white animate-pulse'
                          : 'bg-[#3C6E47] text-white border-[#2A4E33]'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={totalDecisions <= 1}
                      title="Noticia siguiente (Flecha Der)"
                      className="p-2 rounded bg-[#180F09] hover:bg-[#2C1C11] disabled:opacity-40 text-[#EDE6D3] flex items-center justify-center cursor-pointer border border-[#3D2516]"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vintage Rotary Knobs Decoration & Toggles */}
            <div className="border-t border-[#52331F] pt-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#8B98A5]">Líneas CRT:</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setScanlinesActive((s) => !s);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                    scanlinesActive 
                      ? 'bg-[#3C6E47] text-white border-[#2A4E33]' 
                      : 'bg-[#180F09] text-gray-400 border-[#3D2516]'
                  }`}
                >
                  {scanlinesActive ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Speaker Grille simulation */}
              <div className="w-full bg-[#160E08] p-1.5 rounded flex flex-col gap-1 border border-[#3D2516]">
                <div className="w-full h-1 bg-[#2C1C11] rounded-full"></div>
                <div className="w-full h-1 bg-[#2C1C11] rounded-full"></div>
                <div className="w-full h-1 bg-[#2C1C11] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Timeline Quick Selector */}
        {totalDecisions > 0 && (
          <div className="w-full mt-3 bg-[#24170E] border border-[#52331F] rounded-xl p-2 flex items-center gap-2 overflow-x-auto select-none">
            <span className="text-[10px] font-mono text-[#B9902E] font-bold uppercase flex-shrink-0 px-1">
              HISTORIAL:
            </span>
            <div className="flex items-center gap-1.5">
              {history.map((rec, idx) => {
                const isCur = idx === currentIndex;
                return (
                  <button
                    key={rec.expedienteId + '-' + idx}
                    onClick={() => {
                      triggerChannelZap();
                      setCurrentIndex(idx);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition cursor-pointer border flex-shrink-0 flex items-center gap-1 ${
                      isCur
                        ? 'bg-[#B31218] text-white border-white font-bold shadow-md'
                        : 'bg-[#180F09] hover:bg-[#2C1C11] text-[#EDE6D3]/70 border-[#3D2516]'
                    }`}
                    title={`Expediente #${rec.numero} - ${rec.solicitante}`}
                  >
                    <span>#{rec.numero}</span>
                    <span className={`text-[9px] px-1 rounded uppercase ${
                      rec.decision === 'aprobado' ? 'bg-emerald-900 text-emerald-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {rec.decision === 'aprobado' ? 'AP' : 'REC'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
