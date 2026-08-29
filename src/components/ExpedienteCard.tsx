import React from 'react';
import { Expediente, StatKey } from '../types';
import { FileText, Building2, User, Flame, AlertCircle, Stamp } from 'lucide-react';
import { CoimaEnvelope } from './CoimaEnvelope';

interface ExpedienteCardProps {
  expediente: Expediente;
  index: number;
  totalDecisions: number;
  coimaAccepted: boolean;
  onToggleCoima: (accepted: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
  onHoverAction: (deltas: Partial<Record<StatKey, number>> | null) => void;
  folderColorId?: string;
  stampInkId?: string;
}

export const ExpedienteCard: React.FC<ExpedienteCardProps> = ({
  expediente,
  index,
  totalDecisions,
  coimaAccepted,
  onToggleCoima,
  onApprove,
  onReject,
  onHoverAction,
  folderColorId = 'folder_manila_clasica',
  stampInkId = 'ink_violeta_oficial'
}) => {
  // Dynamic Folder styling based on customization
  const getFolderStyles = () => {
    switch (folderColorId) {
      case 'folder_cuero_azul':
        return 'bg-[#1e293b] text-[#F1F5F9] border-[#3B82F6]/40 shadow-[0_14px_28px_rgba(0,0,0,0.6)]';
      case 'folder_rojo_sumario':
        return 'bg-[#2b1618] text-[#FDE8E8] border-[#E02424]/40 shadow-[0_14px_28px_rgba(0,0,0,0.6)]';
      case 'folder_verde_hacienda':
        return 'bg-[#18261e] text-[#ECFDF5] border-[#10B981]/40 shadow-[0_14px_28px_rgba(0,0,0,0.6)]';
      case 'folder_pergamino_antiguo':
        return 'bg-[#ede0c4] text-[#2c2214] border-[#92400e]/50 shadow-[0_14px_28px_rgba(0,0,0,0.45)]';
      case 'folder_manila_clasica':
      default:
        return 'bg-[#F7F2E5] text-[#24303A] border-[#24303A]/30 shadow-[0_12px_24px_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.2)]';
    }
  };

  const isDarkFolder =
    folderColorId === 'folder_cuero_azul' ||
    folderColorId === 'folder_rojo_sumario' ||
    folderColorId === 'folder_verde_hacienda';

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Manila/Custom Folder Container */}
      <div
        id="expediente-main-folder"
        className={`relative w-full border-2 rounded-lg p-5 sm:p-7 overflow-hidden transition-all duration-300 ${getFolderStyles()}`}
      >
        {/* Background Watermark "S/E" (Sin Efecto / Expediente Oficial) */}
        <div className="absolute right-4 top-4 font-['Courier_Prime',monospace] font-black text-6xl sm:text-8xl text-[#B9902E]/10 select-none pointer-events-none rotate-[-12deg]">
          S/E
        </div>

        {/* Diagonal Corner Stamp "RESERVADO" */}
        <div className="absolute -left-10 top-5 bg-[#A5333A]/80 text-[#EDE6D3] font-mono text-[9px] tracking-widest uppercase font-bold py-0.5 px-10 rotate-[-45deg] shadow-sm select-none">
          TRÁMITE OFICIAL
        </div>

        {/* Top Bureaucratic Header */}
        <div className={`border-b-2 border-dashed pb-3 mb-4 flex flex-wrap items-start justify-between gap-2 ${isDarkFolder ? 'border-white/15' : 'border-[#24303A]/20'}`}>
          <div className="flex flex-col">
            <span className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${isDarkFolder ? 'text-[#94A3B8]' : 'text-[#8B98A5]'}`}>
              {expediente.caratula}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded border uppercase tracking-wide ${isDarkFolder ? 'bg-[#38BDF8]/20 text-[#7DD3FC] border-[#38BDF8]/30' : 'bg-[#6CACE4]/25 text-[#1a4a75] border-[#6CACE4]/40'}`}>
                {expediente.rubro}
              </span>
              {expediente.placaRoja && (
                <span className="bg-[#A5333A] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded animate-pulse uppercase tracking-wide">
                  URGENTE
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className={`font-mono text-xs font-bold ${isDarkFolder ? 'text-[#CBD5E1]' : 'text-[#4B5A63]'}`}>
              Exp. #{1000 + totalDecisions}
            </span>
            <div className={`text-[10px] font-mono ${isDarkFolder ? 'text-[#94A3B8]' : 'text-[#4B5A63]/70'}`}>
              Folio: {String((index % 99) + 1).padStart(2, '0')}/140
            </div>
          </div>
        </div>

        {/* Solicitante Box */}
        <div className={`border rounded p-2.5 mb-4 text-xs font-mono ${isDarkFolder ? 'bg-white/5 border-white/10' : 'bg-[#E0D7BE]/40 border-[#24303A]/15'}`}>
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-[#3C6E47] flex-shrink-0 mt-0.5" />
            <div>
              <span className={`font-bold uppercase tracking-wide ${isDarkFolder ? 'text-amber-300' : 'text-[#24303A]'}`}>Solicitante: </span>
              <span className={`font-semibold ${isDarkFolder ? 'text-white' : 'text-[#10171d]'}`}>{expediente.solicitante}</span>
              <div className={`text-[10px] mt-0.5 ${isDarkFolder ? 'text-gray-400' : 'text-[#4B5A63]'}`}>
                Organismo interviniente: {expediente.organismo}
              </div>
            </div>
          </div>
        </div>

        {/* Main Title / Asunto */}
        <h2 className={`text-lg sm:text-xl font-bold font-serif leading-snug mb-3 text-balance ${isDarkFolder ? 'text-white' : 'text-[#10171d]'}`}>
          {expediente.asunto}
        </h2>

        {/* Visto y Considerando (Body) */}
        <div className="relative mb-5">
          <div className="text-[11px] font-mono font-bold text-[#B9902E] uppercase tracking-wider mb-1">
            Visto y Considerando:
          </div>
          <p className={`text-sm sm:text-base font-serif leading-relaxed p-3 rounded border-l-4 border-[#B9902E] italic ${isDarkFolder ? 'bg-black/30 text-gray-200' : 'bg-[#EDE6D3]/40 text-[#24303A]'}`}>
            "{expediente.visto_y_considerando}"
          </p>
        </div>

        {/* Coima / Sobre Marrón (Si el expediente lo tiene adjunto) */}
        {expediente.coima && (
          <CoimaEnvelope
            coima={expediente.coima}
            accepted={coimaAccepted}
            onToggle={onToggleCoima}
          />
        )}

        {/* Post-it Note from the Cynical Advisor */}
        <div className="relative bg-[#FFF9A6] text-[#2c2c2c] p-3 rounded shadow-md border border-[#e6dc7e] rotate-[-1.5deg] mb-6 transition-transform hover:rotate-0">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-[#8c7e2b] mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Nota confidencial del Asesor de Despacho:</span>
          </div>
          <p className="font-['Caveat',cursive] text-base sm:text-lg leading-tight text-[#1c1c1c]">
            "{expediente.nota_asesor}"
          </p>
        </div>

        {/* Actions / Giant Rubber Stamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* RECHAZAR BUTTON */}
          <button
            id="btn-action-reject"
            onClick={onReject}
            onMouseEnter={() => onHoverAction(expediente.r)}
            onMouseLeave={() => onHoverAction(null)}
            className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded bg-[#A5333A] hover:bg-[#8B2329] text-[#EDE6D3] font-['Courier_Prime',monospace] font-bold text-base sm:text-lg uppercase tracking-wider shadow-[0_5px_0_#62181C] active:translate-y-1 active:shadow-[0_1px_0_#62181C] transition cursor-pointer border border-[#7C2226]"
          >
            <div className="flex items-center gap-2">
              <Stamp className="w-5 h-5 group-hover:rotate-[-10deg] transition-transform" />
              <span>RECHAZAR</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans font-normal normal-case italic opacity-90 mt-0.5">
              Sello Rojo · Archivar en Mesa de Entradas
            </span>
          </button>

          {/* AUTORIZAR BUTTON */}
          <button
            id="btn-action-approve"
            onClick={onApprove}
            onMouseEnter={() => onHoverAction(expediente.a)}
            onMouseLeave={() => onHoverAction(null)}
            className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded bg-[#3C6E47] hover:bg-[#2F5938] text-[#EDE6D3] font-['Courier_Prime',monospace] font-bold text-base sm:text-lg uppercase tracking-wider shadow-[0_5px_0_#1E3B24] active:translate-y-1 active:shadow-[0_1px_0_#1E3B24] transition cursor-pointer border border-[#2A4E33]"
          >
            <div className="flex items-center gap-2">
              <Stamp className="w-5 h-5 group-hover:rotate-[10deg] transition-transform" />
              <span>AUTORIZAR</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans font-normal normal-case italic opacity-90 mt-0.5">
              Sello Oficial · Firma Ministerial con Rúbrica
            </span>
          </button>
        </div>

        {/* Keyboard hints */}
        <div className={`mt-3 text-center text-[10px] font-mono italic ${isDarkFolder ? 'text-gray-400' : 'text-[#8B98A5]'}`}>
          Atajos de teclado: <kbd className={`px-1.5 py-0.5 rounded border ${isDarkFolder ? 'bg-white/10 text-white border-white/20' : 'bg-[#E0D7BE] text-[#24303A]'}`}>←</kbd> Rechazar |{' '}
          <kbd className={`px-1.5 py-0.5 rounded border ${isDarkFolder ? 'bg-white/10 text-white border-white/20' : 'bg-[#E0D7BE] text-[#24303A]'}`}>→</kbd> Autorizar
        </div>
      </div>
    </div>
  );
};
