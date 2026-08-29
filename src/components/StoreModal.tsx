import React, { useState } from 'react';
import {
  CustomizationCategory,
  CustomizationItem,
  EquippedCustomizations
} from '../types';
import {
  CUSTOMIZATION_ITEMS,
  CATEGORY_NAMES
} from '../data/customizations';
import { sound } from '../utils/sound';
import { X, Check, Sparkles, Coins, ShoppingBag, Info, Palette } from 'lucide-react';

interface StoreModalProps {
  puntosGestion: number;
  unlockedCustomizations: string[];
  equippedCustomizations: EquippedCustomizations;
  onBuyItem: (item: CustomizationItem) => void;
  onEquipItem: (category: CustomizationCategory, itemId: string) => void;
  onClose: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  puntosGestion,
  unlockedCustomizations,
  equippedCustomizations,
  onBuyItem,
  onEquipItem,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<CustomizationCategory>('desk_theme');

  const categories: CustomizationCategory[] = [
    'desk_theme',
    'stamp_ink',
    'screen_fx',
    'desk_emblem',
    'folder_color'
  ];

  const filteredItems = CUSTOMIZATION_ITEMS.filter(
    (item) => item.category === activeCategory
  );

  const currentCategoryInfo = CATEGORY_NAMES[activeCategory];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div
        id="tienda-suministros-modal"
        className="w-full max-w-3xl bg-[#171c22] text-[#EDE6D3] border-4 border-[#B9902E] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Gold Border */}
        <div className="bg-[#24303A] px-4 py-3 border-b-2 border-[#B9902E] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#B9902E]/20 border border-[#B9902E] flex items-center justify-center text-xl shadow-inner">
              🏬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Courier_Prime',monospace] font-bold text-base sm:text-lg text-[#FFEAA7] tracking-wider">
                  ECONOMATO MINISTERIAL
                </h2>
                <span className="text-[10px] font-mono bg-[#B9902E] text-black font-extrabold px-2 py-0.5 rounded">
                  SUMINISTROS & HUD
                </span>
              </div>
              <p className="text-xs font-mono text-[#8B98A5]">
                Personalizá la estética de tu despacho sin alterar las mecánicas del Estado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Points / Currency pill */}
            <div className="flex items-center gap-1.5 bg-[#101418] px-3 py-1.5 rounded-full border border-[#FFEAA7]/40 shadow-inner">
              <Coins className="w-4 h-4 text-[#FFEAA7] animate-pulse" />
              <span className="font-['Courier_Prime',monospace] font-bold text-sm text-[#FFEAA7]">
                {puntosGestion}
              </span>
              <span className="text-[10px] font-mono text-gray-400">pts de gestión</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#101418] hover:bg-[#2c3b48] text-[#EDE6D3] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#12161b] border-b border-white/10 overflow-x-auto select-none">
          {categories.map((cat) => {
            const catInfo = CATEGORY_NAMES[cat];
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#B9902E] text-black shadow-md border border-[#FFEAA7]'
                    : 'bg-[#1b232a] text-[#C2B29D] hover:bg-[#26323c] border border-transparent'
                }`}
              >
                <span>{catInfo.icon}</span>
                <span>{catInfo.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div className="px-4 py-2 bg-[#1b232c] border-b border-white/5 flex items-center justify-between text-xs text-[#8B98A5] font-mono">
          <span>{currentCategoryInfo.desc}</span>
          <span className="text-[#FFEAA7] font-bold">
            {filteredItems.length} opciones disponibles
          </span>
        </div>

        {/* Store Items Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1b232c] via-[#14181d] to-[#0f1216]">
          {filteredItems.map((item) => {
            const isUnlocked =
              item.cost === 0 || unlockedCustomizations.includes(item.id);
            const isEquipped = equippedCustomizations[item.category] === item.id;
            const canAfford = puntosGestion >= item.cost;

            return (
              <div
                key={item.id}
                className={`relative rounded-xl p-3.5 flex flex-col justify-between transition-all duration-200 border-2 ${
                  isEquipped
                    ? 'bg-[#1e2a33] border-[#FFEAA7] shadow-[0_0_15px_rgba(255,234,167,0.2)]'
                    : isUnlocked
                    ? 'bg-[#161c22] border-white/15 hover:border-white/30'
                    : 'bg-[#12161a] border-white/10 hover:border-amber-500/40'
                }`}
              >
                {/* Top Item Badge & Icon */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className="w-11 h-11 rounded-lg border flex items-center justify-center text-2xl shadow-inner flex-shrink-0"
                      style={{
                        backgroundColor: item.previewColor,
                        borderColor: isEquipped ? '#FFEAA7' : 'rgba(255,255,255,0.2)'
                      }}
                    >
                      {item.previewIcon}
                    </div>

                    <div className="flex flex-col items-end">
                      {isEquipped ? (
                        <span className="flex items-center gap-1 bg-[#3C6E47] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-400">
                          <Check className="w-3 h-3" />
                          <span>EN USO</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="bg-white/10 text-gray-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          ADQUIRIDO
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 bg-[#101418] px-2 py-0.5 rounded-full border border-amber-500/30 font-mono text-xs font-bold text-[#FFEAA7]">
                          <Coins className="w-3 h-3 text-amber-400" />
                          <span>{item.cost} pts</span>
                        </div>
                      )}

                      {item.tag && (
                        <span className="text-[9px] font-mono text-[#8B98A5] mt-1 italic">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-bold text-sm text-[#FAF7EE] mb-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#9BA8B5] font-sans leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 border-t border-white/5">
                  {isEquipped ? (
                    <button
                      disabled
                      className="w-full py-1.5 rounded-lg bg-[#3C6E47]/30 text-emerald-300 font-mono text-xs font-bold border border-emerald-600/40 cursor-default flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Equipado en tu Despacho</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playEquipSound();
                        onEquipItem(item.category, item.id);
                      }}
                      className="w-full py-1.5 rounded-lg bg-[#B9902E] hover:bg-[#A37D24] text-black font-['Courier_Prime',monospace] font-bold text-xs shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Equipar Ahora</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          sound.playCoinChime();
                          onBuyItem(item);
                        } else {
                          sound.playClick();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-1.5 rounded-lg font-['Courier_Prime',monospace] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                        canAfford
                          ? 'bg-[#2E5E3B] hover:bg-[#244B2F] text-white border border-emerald-500 active:scale-95'
                          : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {canAfford ? `Comprar (${item.cost} pts)` : `Faltan ${item.cost - puntosGestion} pts`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer How to earn points */}
        <div className="p-3 bg-[#101418] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#8B98A5]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#B9902E] flex-shrink-0" />
            <span>
              <strong>¿Cómo ganar más puntos?</strong> +10 por expediente despachado · +15 por cebar mate · +150 por ganar al Truco · +250 por nuevo final.
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-[#24303A] hover:bg-[#344452] text-white font-bold transition cursor-pointer"
          >
            Volver al Despacho
          </button>
        </div>
      </div>
    </div>
  );
};
