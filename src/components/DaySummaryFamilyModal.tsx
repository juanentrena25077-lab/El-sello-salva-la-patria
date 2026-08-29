import React, { useState, useMemo } from 'react';
import {
  FamilyHouseholdState,
  FamilyEmergencyEvent,
  FamilyMember,
  DecisionRecord
} from '../types';
import { HOUSEHOLD_COSTS } from '../data/family';
import { sound } from '../utils/sound';
import { Home, AlertTriangle, Heart, Utensils, Flame, Pill, DollarSign, ArrowRight, UserX, Sparkles } from 'lucide-react';

interface DaySummaryFamilyModalProps {
  dayNumber: number;
  dayDecisions: DecisionRecord[];
  patrimonioDolares: number;
  householdState: FamilyHouseholdState;
  onExchangeDolaresToPesos: (amountDolares: number) => void;
  onConfirmBudgetAndSleep: (budgetDecisions: {
    payRent: boolean;
    foodChoice: 'full' | 'basic' | 'none';
    payHeating: boolean;
    payMedicine: boolean;
    payEmergency: boolean;
  }) => void;
}

export const DaySummaryFamilyModal: React.FC<DaySummaryFamilyModalProps> = ({
  dayNumber,
  dayDecisions,
  patrimonioDolares,
  householdState,
  onExchangeDolaresToPesos,
  onConfirmBudgetAndSleep
}) => {
  const [payRent, setPayRent] = useState<boolean>(true);
  const [foodChoice, setFoodChoice] = useState<'full' | 'basic' | 'none'>('basic');
  const [payHeating, setPayHeating] = useState<boolean>(true);
  const [payMedicine, setPayMedicine] = useState<boolean>(false);
  const [payEmergency, setPayEmergency] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'family' | 'work_recap'>('family');

  const emergency = householdState.currentEmergency;

  // Calculate costs
  const foodCost = useMemo(() => {
    if (foodChoice === 'full') return HOUSEHOLD_COSTS.foodFull;
    if (foodChoice === 'basic') return HOUSEHOLD_COSTS.foodBasic;
    return HOUSEHOLD_COSTS.foodNone;
  }, [foodChoice]);

  const rentCost = payRent ? HOUSEHOLD_COSTS.rent : 0;
  const heatCost = payHeating ? HOUSEHOLD_COSTS.heating : 0;
  const medCost = payMedicine ? HOUSEHOLD_COSTS.medicine : 0;
  const emergencyCost = emergency && payEmergency ? emergency.cost : 0;

  const totalExpenses = rentCost + foodCost + heatCost + medCost + emergencyCost;
  const startingPesos = householdState.pesosEnMano;
  const dailySalary = householdState.salaryBase;
  const totalPesosAvailable = startingPesos + dailySalary;
  const remainingPesos = totalPesosAvailable - totalExpenses;
  const isDeficit = remainingPesos < 0;

  // Day stats
  const coimasToday = dayDecisions.filter((d) => d.coimaAceptada);
  const totalCoimaDolaresToday = coimasToday.reduce((acc, c) => acc + (c.montoCoima || 0), 0);

  const handleExchange = () => {
    if (patrimonioDolares >= 50) {
      sound.playCoinChime();
      onExchangeDolaresToPesos(50);
    }
  };

  const handleConfirm = () => {
    if (isDeficit) {
      sound.playTragedySound();
      return;
    }
    sound.playCashPaid();
    onConfirmBudgetAndSleep({
      payRent,
      foodChoice,
      payHeating,
      payMedicine,
      payEmergency
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#1c1712] border-2 border-[#8C6D37] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#EDE6D3]">
        
        {/* Header Papers Please style */}
        <div className="bg-[#2B2015] border-b-2 border-[#8C6D37] p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🏠</span>
            <div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#FFEAA7] font-bold">
                Jornada Laboral Finalizada · 21:00 HS
              </div>
              <h2 className="text-base sm:text-xl font-bold font-serif text-[#EDE6D3] flex items-center gap-2">
                CIERRE DEL DÍA {dayNumber} · ADMINISTRACIÓN DEL HOGAR
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#15100b] px-3 py-1.5 rounded-lg border border-[#8C6D37]/50 font-mono text-xs text-[#FFEAA7]">
            <span>Saldo:</span>
            <span className={`font-bold ${isDeficit ? 'text-red-400' : 'text-emerald-400'}`}>
              ${remainingPesos.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#8C6D37]/30 bg-[#16120e]">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('family');
            }}
            className={`flex-1 py-2.5 px-4 font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'family'
                ? 'bg-[#2B2015] text-[#FFEAA7] border-b-2 border-[#FFEAA7]'
                : 'text-[#EDE6D3]/60 hover:text-[#EDE6D3] hover:bg-[#1f1913]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Familia & Gastos del PH</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('work_recap');
            }}
            className={`flex-1 py-2.5 px-4 font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'work_recap'
                ? 'bg-[#2B2015] text-[#FFEAA7] border-b-2 border-[#FFEAA7]'
                : 'text-[#EDE6D3]/60 hover:text-[#EDE6D3] hover:bg-[#1f1913]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Liquidación Ministerial del Día</span>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 font-sans text-sm">
          {activeTab === 'family' ? (
            <>
              {/* Family Members Status Cards */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#FFEAA7] font-bold mb-2 flex items-center gap-1.5">
                  <span>👨‍👩‍👦</span> Integrantes del Hogar (PH en Villa Luro)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {householdState.members.map((member) => {
                    const isSick = member.status === 'enfermo' || member.status === 'critico';
                    const isHungry = member.status === 'hambriento';
                    const isDead = member.status === 'fallecido';

                    return (
                      <div
                        key={member.id}
                        className={`p-3 rounded-lg border flex flex-col justify-between transition ${
                          isDead
                            ? 'bg-black/60 border-red-900/60 opacity-60'
                            : isSick
                            ? 'bg-red-950/30 border-red-800/60'
                            : isHungry
                            ? 'bg-amber-950/30 border-amber-800/60'
                            : 'bg-[#261c14] border-[#8C6D37]/40'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-3xl">{member.avatar}</span>
                          <div>
                            <div className="font-bold text-sm text-[#EDE6D3]">{member.name}</div>
                            <div className="text-[11px] text-[#EDE6D3]/60">{member.role}</div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#8C6D37]/20">
                          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                            <span>Estado:</span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                                isDead
                                  ? 'bg-red-900 text-white'
                                  : isSick
                                  ? 'bg-red-700/60 text-red-200 animate-pulse'
                                  : isHungry
                                  ? 'bg-amber-600/60 text-amber-200'
                                  : 'bg-emerald-800/60 text-emerald-200'
                              }`}
                            >
                              {member.status}
                            </span>
                          </div>
                          <p className="text-xs italic text-[#EDE6D3]/80 leading-snug">
                            "{member.statusText}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Event Alert (if present) */}
              {emergency && (
                <div className="p-3.5 rounded-lg bg-amber-950/40 border-2 border-amber-600/70 text-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-1.5 bg-amber-900/60 rounded border border-amber-500/40">
                      {emergency.icon}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#FFEAA7] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>IMPREVISTO DOMÉSTICO: {emergency.title}</span>
                      </div>
                      <p className="text-xs text-amber-200/90 mt-0.5">{emergency.description}</p>
                      <div className="text-[11px] text-red-300 font-mono mt-1">
                        Si no pagás: {emergency.consequenceIfNotPaid}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayEmergency(true);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        payEmergency
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✓ Cubrir (${emergency.cost.toLocaleString('es-AR')})
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayEmergency(false);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        !payEmergency
                          ? 'bg-red-700 text-white border-red-500 shadow-md ring-1 ring-red-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✗ Postergar ($0)
                    </button>
                  </div>
                </div>
              )}

              {/* Eviction Warning Alert */}
              {householdState.rentUnpaidDays > 0 && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-700 text-red-200 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <div className="text-xs">
                    <strong className="text-red-300 uppercase">Aviso de Intimación de Desalojo:</strong> Llevás{' '}
                    {householdState.rentUnpaidDays} día(s) sin pagar el alquiler. Si acumulás 2 días seguidos,{' '}
                    <strong>el dueño te saca las cosas a la vereda con la policía</strong>.
                  </div>
                </div>
              )}

              {/* Expenses Checklist */}
              <div className="bg-[#14100c] border border-[#8C6D37]/40 rounded-lg p-3.5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#FFEAA7] font-bold flex items-center justify-between">
                  <span>Presupuesto y Asignación para Esta Noche</span>
                  <span className="text-[11px] font-normal text-[#EDE6D3]/60">
                    Sueldo cobrado: ${dailySalary.toLocaleString('es-AR')}
                  </span>
                </h3>

                {/* Rent Option */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/30 gap-2">
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Alquiler y Expensas del PH</div>
                      <div className="text-[11px] text-[#EDE6D3]/60">
                        Evita intimaciones de desalojo y reclamos del dueño.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayRent(true);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        payRent
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✓ Pagar (${HOUSEHOLD_COSTS.rent.toLocaleString('es-AR')})
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayRent(false);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        !payRent
                          ? 'bg-red-700 text-white border-red-500 shadow-md ring-1 ring-red-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✗ No Pagar ($0)
                    </button>
                  </div>
                </div>

                {/* Food Selection */}
                <div className="p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <div className="font-bold text-sm">Cena Familiar de Esta Noche</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setFoodChoice('full');
                      }}
                      className={`p-2 rounded border text-left font-mono transition cursor-pointer ${
                        foodChoice === 'full'
                          ? 'bg-[#8C6D37]/50 border-emerald-400 text-[#FFEAA7] font-bold shadow-md ring-1 ring-emerald-400'
                          : 'bg-[#15100b] border-[#8C6D37]/20 text-[#EDE6D3]/70 hover:bg-[#201811]'
                      }`}
                    >
                      <div className="text-xs">🥩 Menú Completo</div>
                      <div className="text-[10px] text-emerald-400 font-bold">$16.000</div>
                      <div className="text-[10px] text-[#EDE6D3]/60 mt-0.5">Nutre y cura el hambre</div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setFoodChoice('basic');
                      }}
                      className={`p-2 rounded border text-left font-mono transition cursor-pointer ${
                        foodChoice === 'basic'
                          ? 'bg-[#8C6D37]/50 border-amber-400 text-[#FFEAA7] font-bold shadow-md ring-1 ring-amber-400'
                          : 'bg-[#15100b] border-[#8C6D37]/20 text-[#EDE6D3]/70 hover:bg-[#201811]'
                      }`}
                    >
                      <div className="text-xs">🍲 Polenta y Fideos</div>
                      <div className="text-[10px] text-yellow-400 font-bold">$6.000</div>
                      <div className="text-[10px] text-[#EDE6D3]/60 mt-0.5">Alcanza con lo justo</div>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setFoodChoice('none');
                      }}
                      className={`p-2 rounded border text-left font-mono transition cursor-pointer ${
                        foodChoice === 'none'
                          ? 'bg-red-950/70 border-red-400 text-red-300 font-bold shadow-md ring-1 ring-red-400'
                          : 'bg-[#15100b] border-[#8C6D37]/20 text-[#EDE6D3]/70 hover:bg-[#201811]'
                      }`}
                    >
                      <div className="text-xs">☕ Solo Mate Cocido</div>
                      <div className="text-[10px] text-red-400 font-bold">$0</div>
                      <div className="text-[10px] text-[#EDE6D3]/60 mt-0.5">Se van a dormir con hambre</div>
                    </button>
                  </div>
                </div>

                {/* Heating & Electricity */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/30 gap-2">
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Gas, Garrafa y Luz Eléctrica</div>
                      <div className="text-[11px] text-[#EDE6D3]/60">
                        Mantiene la estufa encendida contra la helada invernal.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayHeating(true);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        payHeating
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✓ Pagar (${HOUSEHOLD_COSTS.heating.toLocaleString('es-AR')})
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayHeating(false);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        !payHeating
                          ? 'bg-red-700 text-white border-red-500 shadow-md ring-1 ring-red-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✗ Cortar ($0)
                    </button>
                  </div>
                </div>

                {/* Medicine / Pharmacy */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/30 gap-2">
                  <div className="flex items-center gap-2.5">
                    <Pill className="w-4 h-4 text-pink-400 shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Farmacia & Remedios PAMI</div>
                      <div className="text-[11px] text-[#EDE6D3]/60">
                        Gotas para la presión y antibióticos para la Nona y Gladys.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayMedicine(true);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        payMedicine
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✓ Comprar (${HOUSEHOLD_COSTS.medicine.toLocaleString('es-AR')})
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPayMedicine(false);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition cursor-pointer ${
                        !payMedicine
                          ? 'bg-red-700 text-white border-red-500 shadow-md ring-1 ring-red-400'
                          : 'bg-[#15100b] text-[#EDE6D3]/60 border-[#8C6D37]/30 hover:bg-[#201811] hover:text-[#EDE6D3]'
                      }`}
                    >
                      ✗ Sin Remedios ($0)
                    </button>
                  </div>
                </div>
              </div>

              {/* Dolares Exchange Option */}
              {patrimonioDolares >= 50 && (
                <div className="p-3 rounded-lg bg-[#201810] border border-[#B9902E]/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💵</span>
                    <div>
                      <div className="text-xs font-bold text-[#FFEAA7]">
                        ¿No te alcanza? Liquidar coimas / Ahorros en Dólares
                      </div>
                      <div className="text-[11px] text-[#EDE6D3]/70">
                        Tenés ${patrimonioDolares.toLocaleString('en-US')} USD guardados en el placard.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleExchange}
                    className="px-3 py-1.5 rounded bg-[#B9902E] hover:bg-[#d4a838] text-black font-mono text-xs font-bold transition cursor-pointer shrink-0 active:scale-95 shadow"
                  >
                    Cambiar $50 USD (+$65.000 ARS)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Work recap tab */
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#15100b] border border-[#8C6D37]/40 space-y-3 font-mono">
                <h3 className="text-sm font-bold text-[#FFEAA7] uppercase tracking-wider">
                  Liquidación Oficial de Haberes · Ministerio de la República
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/20">
                    <div className="text-[#EDE6D3]/60">Sueldo Básico Estatal (Día):</div>
                    <div className="text-base font-bold text-emerald-400">
                      +${dailySalary.toLocaleString('es-AR')}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/20">
                    <div className="text-[#EDE6D3]/60">Expedientes Despachados Hoy:</div>
                    <div className="text-base font-bold text-[#FFEAA7]">
                      {dayDecisions.length} trámite(s)
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/20">
                    <div className="text-[#EDE6D3]/60">Sobres Recibidos Hoy:</div>
                    <div className="text-base font-bold text-amber-400">
                      {coimasToday.length} sobre(s) (${totalCoimaDolaresToday} USD)
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-[#1e1711] border border-[#8C6D37]/20">
                    <div className="text-[#EDE6D3]/60">Ahorro en Dólares Totales:</div>
                    <div className="text-base font-bold text-sky-400">
                      ${patrimonioDolares.toLocaleString('en-US')} USD
                    </div>
                  </div>
                </div>
              </div>

              {/* List of decisions taken today */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#FFEAA7] font-bold mb-2">
                  Trámites Firmados en el Despacho Hoy:
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {dayDecisions.map((dec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#16120e] border border-[#8C6D37]/20 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-[#EDE6D3]">{dec.caratula}</span>
                        <div className="text-[11px] text-[#EDE6D3]/60">{dec.asunto}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase shrink-0 ${
                          dec.decision === 'aprobado'
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/40'
                            : 'bg-red-900/60 text-red-300 border border-red-600/40'
                        }`}
                      >
                        {dec.decision}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with financial balance & Sleep button */}
        <div className="bg-[#22180e] border-t-2 border-[#8C6D37] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#EDE6D3]/70">Gastos calculados:</span>
              <strong className="text-amber-300 font-bold">${totalExpenses.toLocaleString('es-AR')}</strong>
            </div>
            <div className="text-[11px] text-[#EDE6D3]/50">
              Quedarán: <span className={isDeficit ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>${remainingPesos.toLocaleString('es-AR')}</span> en la billetera
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isDeficit}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
              isDeficit
                ? 'bg-red-950/80 text-red-300 border border-red-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B9902E] to-[#d4a838] hover:from-[#d4a838] hover:to-[#e6bc4a] text-black border border-yellow-200'
            }`}
          >
            {isDeficit ? (
              <span>Fondos Insuficientes (Vendé Dólares o recortá gastos)</span>
            ) : (
              <>
                <span>CONFIRMAR GASTOS E IR A DORMIR</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
