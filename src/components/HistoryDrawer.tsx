import React from 'react';
import { DecisionRecord, StatKey } from '../types';
import { STAT_CONFIG } from '../data/endings';
import { X, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { sound } from '../utils/sound';

interface HistoryDrawerProps {
  history: DecisionRecord[];
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#EDE6D3] text-[#24303A] border-2 border-[#24303A] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#24303A] text-[#EDE6D3] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#B9902E]" />
            <div>
              <h3 className="font-['Courier_Prime',monospace] font-bold text-lg leading-tight uppercase tracking-wider">
                Legajo de Resoluciones Oficiales
              </h3>
              <p className="text-xs text-[#8B98A5] font-mono">
                Registro histórico de firmas y archivos del despacho ({history.length} trámites)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-[#324352] text-[#EDE6D3] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EDE6D3]/80">
          {history.length === 0 ? (
            <div className="text-center py-12 text-[#4B5A63] font-mono text-sm">
              <p className="italic">El legajo está vacío todavía.</p>
              <p className="text-xs mt-1 text-[#8B98A5]">
                Comenzá a firmar o rechazar expedientes para registrar las resoluciones oficiales.
              </p>
            </div>
          ) : (
            history.map((item, idx) => {
              const isApproved = item.decision === 'aprobado';
              return (
                <div
                  key={`${item.expedienteId}-${idx}`}
                  className="bg-[#F7F2E5] border border-[#24303A]/20 rounded p-3.5 shadow-sm transition hover:border-[#24303A]/40"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-[#24303A]/10 pb-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#8B98A5] uppercase">
                          {item.caratula}
                        </span>
                        <span className="bg-[#E0D7BE] text-[#24303A] font-mono text-[9px] px-1.5 py-0.2 rounded uppercase">
                          {item.rubro}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#10171d] mt-0.5">
                        {item.asunto}
                      </h4>
                      <div className="text-[11px] font-mono text-[#4B5A63]">
                        Solicitó: <b>{item.solicitante}</b>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 uppercase ${
                        isApproved
                          ? 'bg-[#3C6E47]/20 text-[#2A4E33] border border-[#3C6E47]/40'
                          : 'bg-[#A5333A]/20 text-[#7C2226] border border-[#A5333A]/40'
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{isApproved ? 'AUTORIZADO' : 'RECHAZADO'}</span>
                    </div>
                  </div>

                  <p className="text-xs font-serif text-[#24303A] italic bg-[#EDE6D3]/50 p-2 rounded border-l-2 border-[#24303A]/30 mb-2">
                    "{item.consecuencia}"
                  </p>

                  {/* Deltas */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    {(Object.keys(item.deltas) as StatKey[]).map((key) => {
                      const d = item.deltas[key];
                      if (!d) return null;
                      const name = STAT_CONFIG[key].name;
                      return (
                        <span
                          key={key}
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            d > 0
                              ? 'bg-[#3C6E47]/15 text-[#2A4E33]'
                              : 'bg-[#A5333A]/15 text-[#7C2226]'
                          }`}
                        >
                          {name}: {d > 0 ? `+${d}` : d}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#E0D7BE] p-3 border-t border-[#24303A]/20 flex justify-between items-center text-xs font-mono text-[#4B5A63]">
          <span>Archivo General de la Nación</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-[#24303A] text-[#EDE6D3] font-bold hover:bg-[#10171d] transition cursor-pointer"
          >
            Cerrar Legajo
          </button>
        </div>
      </div>
    </div>
  );
};
