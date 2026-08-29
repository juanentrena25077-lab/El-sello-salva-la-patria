import React, { useState, useEffect } from 'react';
import { radio, RADIO_STATIONS, RadioStation } from '../utils/radio';
import { Radio, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, Music, RadioTower } from 'lucide-react';
import { sound } from '../utils/sound';

interface RadioModalProps {
  onClose: () => void;
}

export const RadioModal: React.FC<RadioModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(radio.getIsPlaying());
  const [currentStation, setCurrentStation] = useState<RadioStation>(radio.getStation());
  const [volume, setVolume] = useState<number>(radio.getVolume());

  useEffect(() => {
    const unsub = radio.subscribe(() => {
      setIsPlaying(radio.getIsPlaying());
      setCurrentStation(radio.getStation());
      setVolume(radio.getVolume());
    });
    return () => unsub();
  }, []);

  const handleTogglePlay = () => {
    sound.playClick();
    radio.togglePlay();
  };

  const handleSelectStation = (index: number) => {
    sound.playClick();
    radio.setStation(index);
    if (!isPlaying) {
      radio.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    radio.setVolume(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#221B16] text-[#EDE6D3] border-4 border-[#5E422C] rounded-2xl shadow-2xl p-5 sm:p-7 relative overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Vintage Radio Grille Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#402816_1px,transparent_1px)] [background-size:8px_8px] opacity-25 pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#5E422C] pb-3 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#3D2614] border border-[#7A5636] text-[#B9902E]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B9902E] font-bold">
                Radio Despacho · Sintonizador Nacional
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Courier_Prime',monospace] tracking-wider text-[#EDE6D3]">
                SPICA DEL MINISTERIO
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#3D2614] hover:bg-[#5E422C] text-[#EDE6D3] transition cursor-pointer border border-[#7A5636]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vintage Dial Display */}
        <div className="relative z-10 bg-[#120D09] border-2 border-[#7A5636] rounded-xl p-4 mb-4 shadow-inner">
          <div className="flex items-center justify-between text-xs font-mono text-[#8B98A5] mb-2 border-b border-[#3D2614] pb-1.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#3C6E47] animate-ping' : 'bg-[#A5333A]'}`}></span>
              <span className="font-bold text-[#EDE6D3]">
                {isPlaying ? 'EN EL AIRE' : 'EN ESPERA'}
              </span>
            </div>
            <span className="font-mono text-[#B9902E] font-bold tracking-widest text-sm">
              {currentStation.dial}
            </span>
          </div>

          {/* Station Title & Animated Frequency Bars */}
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-lg sm:text-xl font-bold font-serif text-[#EDE6D3]">
                {currentStation.name}
              </div>
              <div className="text-xs font-mono text-[#B9902E] uppercase tracking-wider">
                {currentStation.genre}
              </div>
            </div>

            {/* Equalizer bars animation */}
            <div className="flex items-end gap-1 h-8 w-14">
              {[40, 80, 60, 100, 50, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 bg-[#B9902E] rounded-t transition-all duration-150 ${
                    isPlaying ? 'animate-pulse' : 'h-1 opacity-30'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (i % 2 === 0 ? 0.9 : 1.1))) % 100}%` : '4px'
                  }}
                ></div>
              ))}
            </div>
          </div>

          <p className="text-xs font-serif text-[#C4B79B] italic mt-1 border-t border-[#3D2614] pt-2">
            "{currentStation.description}"
          </p>

          {/* Analog Tuning Scale Slider */}
          <div className="mt-4 pt-2">
            <div className="flex justify-between text-[9px] font-mono text-[#7A5636] uppercase tracking-widest mb-1 px-1">
              <span>92.4</span>
              <span>98.7</span>
              <span>101.5</span>
              <span>104.3</span>
            </div>
            <div className="h-3 bg-[#24170D] rounded-full border border-[#5E422C] relative flex items-center px-1">
              <div
                className="w-4 h-5 bg-[#A5333A] rounded shadow-md border border-[#EDE6D3] transition-all duration-300 absolute -top-1"
                style={{
                  left: `calc(${(radio.getStationIndex() / (RADIO_STATIONS.length - 1)) * 90}% + 2px)`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Controls (Play / Prev / Next / Volume) */}
        <div className="relative z-10 flex flex-col gap-3 bg-[#332012] border border-[#5E422C] rounded-xl p-3.5 mb-4 shadow">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.playClick();
                radio.prevStation();
              }}
              title="Estación Anterior"
              className="p-3 rounded-full bg-[#4A301B] hover:bg-[#5E422C] text-[#EDE6D3] border border-[#7A5636] active:scale-95 transition cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              title={isPlaying ? 'Pausar Radio' : 'Encender Radio'}
              className={`p-4 rounded-full font-bold text-white shadow-lg active:scale-95 transition cursor-pointer border ${
                isPlaying
                  ? 'bg-[#A5333A] hover:bg-[#8A282E] border-[#5C1B1F]'
                  : 'bg-[#3C6E47] hover:bg-[#2F5938] border-[#224429]'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                radio.nextStation();
              }}
              title="Siguiente Estación"
              className="p-3 rounded-full bg-[#4A301B] hover:bg-[#5E422C] text-[#EDE6D3] border border-[#7A5636] active:scale-95 transition cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 px-2 pt-1 border-t border-[#4A301B]">
            <VolumeX className="w-4 h-4 text-[#8B98A5]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 accent-[#B9902E] cursor-pointer h-1.5 bg-[#1C120A] rounded-lg"
            />
            <Volume2 className="w-4 h-4 text-[#B9902E]" />
            <span className="text-[10px] font-mono text-[#8B98A5] w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Station Presets List */}
        <div className="relative z-10 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#B9902E] font-bold">
            Dial de Sintonía Fija:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {RADIO_STATIONS.map((station, idx) => {
              const isSelected = station.id === currentStation.id;
              return (
                <button
                  key={station.id}
                  onClick={() => handleSelectStation(idx)}
                  className={`p-2.5 rounded-lg text-left border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#5E422C] border-[#B9902E] text-white shadow-md'
                      : 'bg-[#291A0E] border-[#4A301B] text-[#C4B79B] hover:bg-[#3D2614]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold text-[#B9902E]">
                      {station.dial}
                    </span>
                    {isSelected && isPlaying && (
                      <RadioTower className="w-3.5 h-3.5 text-[#6CACE4] animate-pulse" />
                    )}
                  </div>
                  <span className="font-serif font-bold text-xs mt-1 truncate w-full">
                    {station.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#8B98A5] truncate w-full">
                    {station.genre}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer tip */}
        <div className="relative z-10 mt-4 text-center text-[10px] font-mono text-[#8B98A5]">
          La música sigue sonando en segundo plano mientras firmás expedientes.
        </div>
      </div>
    </div>
  );
};
