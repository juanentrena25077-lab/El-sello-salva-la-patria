import React from 'react';

interface ImpactStampOverlayProps {
  approved: boolean;
  stampInkId?: string;
}

export const ImpactStampOverlay: React.FC<ImpactStampOverlayProps> = ({
  approved,
  stampInkId = 'ink_dual_bicolor'
}) => {
  const getStampStyles = () => {
    switch (stampInkId) {
      case 'ink_dual_bicolor':
        return approved
          ? 'text-[#16a34a] border-[#16a34a] bg-[#16a34a]/20 rotate-[-8deg] shadow-[0_0_30px_rgba(22,163,74,0.45)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]'
          : 'text-[#dc2626] border-[#dc2626] bg-[#dc2626]/20 rotate-[-12deg] shadow-[0_0_30px_rgba(220,38,38,0.45)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]';
      case 'ink_neon_resaltador':
        return approved
          ? 'text-[#4ade80] border-[#4ade80] bg-[#4ade80]/25 rotate-[-8deg] shadow-[0_0_35px_rgba(74,222,128,0.6)]'
          : 'text-[#f87171] border-[#f87171] bg-[#f87171]/25 rotate-[-12deg] shadow-[0_0_35px_rgba(248,113,113,0.6)]';
      case 'ink_violeta_oficial':
        return approved
          ? 'text-[#7c3aed] border-[#7c3aed] bg-[#7c3aed]/20 rotate-[-8deg] shadow-[0_0_25px_rgba(124,58,237,0.4)]'
          : 'text-[#be185d] border-[#be185d] bg-[#be185d]/20 rotate-[-12deg] shadow-[0_0_25px_rgba(190,24,93,0.4)]';
      case 'ink_lacre_carmesi':
        return approved
          ? 'text-[#b91c1c] border-[#b91c1c] bg-[#b91c1c]/25 rotate-[-8deg] shadow-[0_0_30px_rgba(185,28,28,0.5)]'
          : 'text-[#7f1d1d] border-[#7f1d1d] bg-[#7f1d1d]/25 rotate-[-12deg] shadow-[0_0_30px_rgba(127,29,29,0.5)]';
      case 'ink_verde_dolar':
        return approved
          ? 'text-[#059669] border-[#059669] bg-[#059669]/25 rotate-[-8deg] shadow-[0_0_30px_rgba(5,150,105,0.45)]'
          : 'text-[#991b1b] border-[#991b1b] bg-[#991b1b]/25 rotate-[-12deg] shadow-[0_0_30px_rgba(153,27,27,0.45)]';
      case 'ink_dorado_imperial':
        return approved
          ? 'text-[#eab308] border-[#eab308] bg-[#eab308]/25 rotate-[-8deg] shadow-[0_0_35px_rgba(234,179,8,0.55)]'
          : 'text-[#ca8a04] border-[#ca8a04] bg-[#ca8a04]/25 rotate-[-12deg] shadow-[0_0_35px_rgba(202,138,4,0.55)]';
      case 'ink_azul_patrio':
        return approved
          ? 'text-[#0284c7] border-[#0284c7] bg-[#0284c7]/25 rotate-[-8deg] shadow-[0_0_30px_rgba(2,132,199,0.45)]'
          : 'text-[#b91c1c] border-[#b91c1c] bg-[#b91c1c]/25 rotate-[-12deg] shadow-[0_0_30px_rgba(185,28,28,0.45)]';
      case 'ink_negro_sumario':
        return approved
          ? 'text-[#18181b] border-[#18181b] bg-[#18181b]/30 rotate-[-8deg] shadow-[0_0_20px_rgba(0,0,0,0.6)]'
          : 'text-[#09090b] border-[#09090b] bg-[#09090b]/35 rotate-[-12deg] shadow-[0_0_20px_rgba(0,0,0,0.7)]';
      default:
        return approved
          ? 'text-[#16a34a] border-[#16a34a] bg-[#16a34a]/20 rotate-[-8deg] shadow-[0_0_30px_rgba(22,163,74,0.45)]'
          : 'text-[#dc2626] border-[#dc2626] bg-[#dc2626]/20 rotate-[-12deg] shadow-[0_0_30px_rgba(220,38,38,0.45)]';
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 overflow-hidden rounded-lg bg-black/15 backdrop-blur-[1px]">
      <div
        className={`px-8 py-4 border-[6px] rounded-lg font-['Courier_Prime',monospace] font-black text-3xl sm:text-5xl uppercase tracking-[0.25em] shadow-2xl animate-[stampSlam_0.5s_cubic-bezier(0.2,1.4,0.4,1)_forwards] ${getStampStyles()}`}
      >
        {approved ? 'AUTORIZADO' : 'RECHAZADO'}
        <div className="text-[10px] font-mono tracking-widest text-center mt-1 opacity-90">
          PODER EJECUTIVO NACIONAL · REGISTRADO
        </div>
      </div>
    </div>
  );
};


