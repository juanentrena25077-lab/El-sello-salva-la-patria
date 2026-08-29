import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, History, Award, Coffee, Radio, Tv, ShoppingBag, Coins, Clock } from 'lucide-react';
import { sound } from '../utils/sound';
import { radio } from '../utils/radio';
import { TICKER_NEWS } from '../data/endings';

interface DeskHeaderProps {
  decisionCount: number;
  unlockedEndingsCount: number;
  totalEndingsCount: number;
  patrimonioDolares: number;
  unlockedSouvenirsCount: number;
  totalSouvenirsCount: number;
  phoneRinging: boolean;
  puntosGestion: number;
  deskEmblemId?: string;
  workdayTime: string;
  workdayProgress: number; // 0 to 100
  dayNumber: number;
  pesosEnMano: number;
  onOpenHistory: () => void;
  onOpenEndings: () => void;
  onOpenMate: () => void;
  onOpenRadio: () => void;
  onOpenTv: () => void;
  onOpenSouvenirs: () => void;
  onOpenPhone: () => void;
  onOpenTruco: () => void;
  onOpenStore: () => void;
  mateCount: number;
}

export const DeskHeader: React.FC<DeskHeaderProps> = ({
  decisionCount,
  unlockedEndingsCount,
  totalEndingsCount,
  patrimonioDolares,
  unlockedSouvenirsCount,
  totalSouvenirsCount,
  phoneRinging,
  puntosGestion,
  deskEmblemId = 'emblem_sol_republicano',
  workdayTime,
  workdayProgress,
  dayNumber,
  pesosEnMano,
  onOpenHistory,
  onOpenEndings,
  onOpenMate,
  onOpenRadio,
  onOpenTv,
  onOpenSouvenirs,
  onOpenPhone,
  onOpenTruco,
  onOpenStore,
  mateCount
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.enabled);
  const [radioPlaying, setRadioPlaying] = useState<boolean>(radio.getIsPlaying());
  const [radioStation, setRadioStation] = useState<string>(radio.getStation().dial);
  const [tickerIndex, setTickerIndex] = useState<number>(0);
  const [tickerFade, setTickerFade] = useState<boolean>(true);

  // Day of the week calculation (Lunes a Viernes)
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const currentDay = daysOfWeek[decisionCount % 5];
  const weekNumber = Math.floor(decisionCount / 5) + 1;

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  useEffect(() => {
    const unsub = radio.subscribe(() => {
      setRadioPlaying(radio.getIsPlaying());
      setRadioStation(radio.getStation().dial);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerFade(false);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % TICKER_NEWS.length);
        setTickerFade(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Custom emblem renderer
  const renderEmblem = () => {
    switch (deskEmblemId) {
      case 'emblem_sol_sonriente_1818':
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-200 animate-[pulse_4s_infinite]">
            🌞
          </div>
        );
      case 'emblem_carpincho_escribano':
        return (
          <div className="w-10 h-10 rounded-full bg-[#5c3e1e] flex items-center justify-center text-2xl shadow-lg border-2 border-amber-600">
            🦫
          </div>
        );
      case 'emblem_mate_laureles':
        return (
          <div className="w-10 h-10 rounded-full bg-[#1e3a24] flex items-center justify-center text-2xl shadow-lg border-2 border-emerald-500">
            🧉
          </div>
        );
      case 'emblem_escarapela_flameante':
        return (
          <div className="w-10 h-10 rounded-full bg-[#0d2a45] flex items-center justify-center text-2xl shadow-lg border-2 border-sky-400">
            🏵️
          </div>
        );
      case 'emblem_sol_republicano':
      default:
        return (
          <div className="relative flex-shrink-0">
            <svg
              className="w-9 h-9 text-[#B9902E] filter drop-shadow-[0_2px_4px_rgba(185,144,46,0.3)] animate-[spin_60s_linear_infinite]"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="20" />
              {[...Array(16)].map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="4"
                  width="4"
                  height="16"
                  rx="2"
                  transform={`rotate(${i * 22.5} 50 50)`}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-[#181a1b]/20"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <header className="relative w-full max-w-2xl mx-auto mb-4 select-none">
      {/* Top Bar with actions */}
      <div className="flex items-center justify-between px-2 py-1.5 text-xs font-mono text-[#E0D7BE] border-b border-[#24303A]/40 pb-2 mb-3 bg-[#11161a]/60 rounded-lg p-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#18222a] px-2 py-1 rounded border border-[#6CACE4]/30 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#6CACE4] animate-pulse" />
            <span className="font-bold text-[#6CACE4] tracking-wider text-xs">{workdayTime}</span>
            <div className="w-12 h-1.5 bg-black/40 rounded-full overflow-hidden border border-[#6CACE4]/20 hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-[#6CACE4] to-[#B9902E] transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, workdayProgress))}%` }}
              />
            </div>
          </div>

          <span className="text-[#B9902E] font-bold tracking-wider uppercase text-[11px] hidden sm:inline">
            Día {dayNumber} ({currentDay})
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* Economato / Tienda de Personalización */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenStore();
            }}
            title="Abrir Economato Ministerial: Comprar y equipar temas visuales, tintas de sello y filtros CRT con tus puntos"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2B2317] hover:bg-[#3D3220] text-[#FFEAA7] border border-[#B9902E] transition cursor-pointer active:scale-95 shadow-sm"
          >
            <Coins className="w-3.5 h-3.5 text-[#FFEAA7] animate-pulse" />
            <span className="font-bold">{puntosGestion} pts</span>
            <span className="text-[10px] bg-[#B9902E]/40 px-1 py-0.2 rounded font-mono text-[#FFF] hidden sm:inline">
              Tienda
            </span>
          </button>

          {/* Teléfono Rojo a Disco */}
          <button
            onClick={() => {
              if (phoneRinging) {
                sound.playPhoneRing();
              } else {
                sound.playClick();
              }
              onOpenPhone();
            }}
            title={phoneRinging ? '¡TELÉFONO ROJO SONANDO! Llamada urgente del Presidente o FMI' : 'Teléfono Rojo Ministerial de Emergencia'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-bold transition cursor-pointer border active:scale-95 ${
              phoneRinging
                ? 'bg-[#A5333A] hover:bg-[#8B2329] text-white border-[#FFE600] animate-bounce shadow-[0_0_15px_rgba(255,230,0,0.5)]'
                : 'bg-[#221A1A] hover:bg-[#332222] text-[#E0B4B4] border-[#7C2226]/60'
            }`}
          >
            <span className="text-sm">{phoneRinging ? '☎️' : '📞'}</span>
            <span className="hidden sm:inline">{phoneRinging ? '¡LLAMADA ENTRANTE!' : 'Teléfono'}</span>
          </button>

          {/* Vitrina & Patrimonio */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSouvenirs();
            }}
            title="Ver vitrina de reliquias y patrimonio personal en el extranjero"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262018] hover:bg-[#362D22] text-[#E5C158] border border-[#B9902E]/50 transition cursor-pointer active:scale-95"
          >
            <Award className="w-3.5 h-3.5 text-[#E5C158]" />
            <span className="font-bold hidden sm:inline">
              {patrimonioDolares > 0 ? `US$ ${(patrimonioDolares / 1000).toFixed(0)}k` : 'Vitrina'}
            </span>
            <span className="text-[10px] bg-[#B9902E]/30 px-1 py-0.2 rounded font-mono text-white">
              {unlockedSouvenirsCount}/{totalSouvenirsCount}
            </span>
          </button>

          {/* Jugar al Truco Button */}
          <button
            onClick={() => {
              sound.playCardSlap();
              onOpenTruco();
            }}
            title="Jugar una manito de Truco Criollo contra tu superior Anselmo Garramuño"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#162e1c] hover:bg-[#204429] text-[#78E08F] border border-emerald-600/50 transition cursor-pointer active:scale-95"
          >
            <span className="text-sm">🃏</span>
            <span className="font-bold hidden sm:inline">Truco</span>
          </button>

          {/* TV Button */}
          <button
            onClick={() => {
              sound.playTvStinger();
              onOpenTv();
            }}
            title="Encender Televisión CRT: Ver consecuencias y noticias en vivo de tus decisiones"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-[#9E1B22] via-[#C0151D] to-[#9E1B22] hover:brightness-110 text-white font-mono text-xs font-extrabold cursor-pointer border-2 border-[#FFE600] shadow-[0_0_12px_rgba(255,230,0,0.35)] active:scale-95 transition animate-pulse"
          >
            <Tv className="w-3.5 h-3.5 text-[#FFE600]" />
            <span className="tracking-wider uppercase">TV EN VIVO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping hidden sm:inline-block"></span>
          </button>

          {/* Radio Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRadio();
            }}
            title="Sintonizar Radio Despacho (Tango, Cumbia, Folklore, Rock)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer border active:scale-95 ${
              radioPlaying
                ? 'bg-[#5E422C] hover:bg-[#735237] text-white border-[#B9902E] shadow-sm'
                : 'bg-[#22303C] hover:bg-[#2F4354] text-[#EDE6D3] border-[#4B5A63]/50'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${radioPlaying ? 'text-[#B9902E] animate-pulse' : 'text-[#6CACE4]'}`} />
            <span className="font-bold hidden sm:inline">{radioPlaying ? `Radio ${radioStation}` : 'Radio'}</span>
            <span className="font-bold sm:hidden">{radioPlaying ? 'FM' : 'Radio'}</span>
          </button>

          {/* Mate Button */}
          <button
            onClick={() => {
              sound.playMateSip();
              onOpenMate();
            }}
            title="Cebar un mate en el despacho"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2D4536] hover:bg-[#3C6E47] text-[#E0D7BE] transition cursor-pointer border border-[#3C6E47]/50 active:scale-95"
          >
            <Coffee className="w-3.5 h-3.5 text-[#B9902E]" />
            <span className="font-bold">{mateCount > 0 ? `${mateCount} mates` : 'Cebar Mate'}</span>
          </button>

          {/* History / Legajo Button */}
          <button
            onClick={() => {
              sound.playPageTurn();
              onOpenHistory();
            }}
            title="Ver legajo de resoluciones previas"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#22303C] hover:bg-[#2F4354] text-[#EDE6D3] transition cursor-pointer border border-[#4B5A63]/50 active:scale-95"
          >
            <History className="w-3.5 h-3.5 text-[#6CACE4]" />
            <span className="hidden sm:inline">Legajo</span>
            <span className="bg-[#6CACE4] text-[#10171d] font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {decisionCount}
            </span>
          </button>

          {/* Finales Desbloqueados Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenEndings();
            }}
            title="Ver finales desbloqueados"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#22303C] hover:bg-[#2F4354] text-[#EDE6D3] transition cursor-pointer border border-[#4B5A63]/50 active:scale-95"
          >
            <Award className="w-3.5 h-3.5 text-[#B9902E]" />
            <span className="hidden sm:inline">Finales</span>
            <span className="text-[#B9902E] font-bold text-[10px]">
              {unlockedEndingsCount}/{totalEndingsCount}
            </span>
          </button>

          {/* Audio Toggle Button */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
            className="p-1.5 rounded bg-[#22303C] hover:bg-[#2F4354] text-[#EDE6D3] transition cursor-pointer border border-[#4B5A63]/50 active:scale-95"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#6CACE4]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#A5333A]" />
            )}
          </button>
        </div>
      </div>

      {/* Main Official Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-3">
          {/* Custom Emblem */}
          {renderEmblem()}

          <div>
            <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-[#B9902E] font-bold">
              República Argentina · Poder Ejecutivo
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-[0.25em] text-[#EDE6D3] font-['Courier_Prime',monospace] m-0 drop-shadow-md">
              EL SELLO
            </h1>
          </div>
        </div>

        <div className="mt-1 text-xs sm:text-sm italic text-[#E0D7BE]/80 font-serif">
          Ministerio de Trámites Varios · Vos decidís. El país aguanta lo que puede.
        </div>

        {/* Flag Rule (Celeste y Blanca) */}
        <div className="w-full h-2 my-2 rounded-full overflow-hidden flex shadow-inner border border-black/20">
          <div className="flex-1 bg-[#6CACE4]"></div>
          <div className="w-1/3 bg-[#F7F2E5] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B9902E]"></div>
          </div>
          <div className="flex-1 bg-[#6CACE4]"></div>
        </div>

        {/* News Ticker */}
        <div 
          onClick={() => {
            sound.playTvStinger();
            onOpenTv();
          }}
          title="Click para ver la transmisión de televisión de las decisiones"
          className="w-full bg-[#181a1b]/85 hover:bg-[#20272e] border border-[#24303A] hover:border-[#FFE600]/60 rounded px-3 py-1.5 mt-1 flex items-center justify-between gap-2 overflow-hidden shadow-inner cursor-pointer transition group"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-[#A5333A] group-hover:bg-[#C0151D] text-white font-mono font-bold text-[9px] uppercase px-1.5 py-0.5 rounded flex-shrink-0 animate-pulse flex items-center gap-1">
              <Tv className="w-2.5 h-2.5" />
              <span>URGENTE</span>
            </span>
            <div
              className={`text-xs font-mono text-[#E0D7BE]/90 group-hover:text-[#FFE600] truncate transition-opacity duration-300 ${
                tickerFade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {TICKER_NEWS[tickerIndex]}
            </div>
          </div>

          <span className="text-[10px] font-mono text-[#FFE600] opacity-80 group-hover:opacity-100 flex-shrink-0 hidden sm:inline">
            [Ver TV 📺]
          </span>
        </div>
      </div>
    </header>
  );
};

