import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Stats,
  StatKey,
  Expediente,
  DecisionRecord,
  Ending,
  PhoneCall,
  Souvenir,
  CustomizationCategory,
  CustomizationItem,
  EquippedCustomizations,
  FamilyHouseholdState
} from './types';
import { EXPEDIENTES } from './data/expedientes';
import { ENDINGS, STAT_CONFIG } from './data/endings';
import { PHONE_CALLS, SOUVENIRS } from './data/extras';
import { DEFAULT_EQUIPPED } from './data/customizations';
import { INITIAL_HOUSEHOLD_STATE, HOUSEHOLD_COSTS, FAMILY_EMERGENCIES } from './data/family';
import { DeskHeader } from './components/DeskHeader';
import { MetersBar } from './components/MetersBar';
import { ExpedienteCard } from './components/ExpedienteCard';
import { ImpactStampOverlay } from './components/ImpactStampOverlay';
import { ConsequenceModal } from './components/ConsequenceModal';
import { EndingScreen } from './components/EndingScreen';
import { MenuScreen } from './components/MenuScreen';
import { HistoryDrawer } from './components/HistoryDrawer';
import { EndingsModal } from './components/EndingsModal';
import { MateModal } from './components/MateModal';
import { RadioModal } from './components/RadioModal';
import { TvModal } from './components/TvModal';
import { PhoneModal } from './components/PhoneModal';
import { SouvenirsModal } from './components/SouvenirsModal';
import { IntroSuperiorModal } from './components/IntroSuperiorModal';
import { TrucoModal } from './components/TrucoModal';
import { StoreModal } from './components/StoreModal';
import { DaySummaryFamilyModal } from './components/DaySummaryFamilyModal';
import { sound } from './utils/sound';
import { radio } from './utils/radio';

const SAVE_STORAGE_KEY = 'el_sello_game_save_v4';
const UNLOCKED_ENDINGS_KEY = 'el_sello_unlocked_endings_v4';
const UNLOCKED_SOUVENIRS_KEY = 'el_sello_unlocked_souvenirs_v4';
const PUNTOS_GESTION_KEY = 'el_sello_puntos_gestion_v1';
const CUSTOMIZATIONS_UNLOCKED_KEY = 'el_sello_customizations_unlocked_v1';
const CUSTOMIZATIONS_EQUIPPED_KEY = 'el_sello_customizations_equipped_v1';
const HOUSEHOLD_STORAGE_KEY = 'el_sello_household_state_v1';

function shuffleDeck(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clamp(val: number): number {
  return Math.max(0, Math.min(100, val));
}

export default function App() {
  const [view, setView] = useState<'menu' | 'playing' | 'stamping' | 'consequence' | 'ending'>('menu');
  const [stats, setStats] = useState<Stats>({ pueblo: 50, caos: 50, guita: 50, instituciones: 50 });
  const [decisionCount, setDecisionCount] = useState<number>(0);
  const [patrimonioDolares, setPatrimonioDolares] = useState<number>(0);
  const [allanamientoRiesgo, setAllanamientoRiesgo] = useState<number>(0);
  const [history, setHistory] = useState<DecisionRecord[]>([]);
  const [deck, setDeck] = useState<number[]>(() => shuffleDeck(EXPEDIENTES.length));
  const [deckIndex, setDeckIndex] = useState<number>(0);
  const [mateCount, setMateCount] = useState<number>(0);

  const [currentApproved, setCurrentApproved] = useState<boolean>(false);
  const [decidedExpediente, setDecidedExpediente] = useState<Expediente | null>(null);
  const [hoverDeltas, setHoverDeltas] = useState<Partial<Record<StatKey, number>> | null>(null);
  const [activeDeltas, setActiveDeltas] = useState<Partial<Record<StatKey, number>> | null>(null);
  const [activeEnding, setActiveEnding] = useState<Ending | null>(null);

  // Coima state on current card
  const [coimaAccepted, setCoimaAccepted] = useState<boolean>(false);

  // Red Phone state
  const [phoneOpen, setPhoneOpen] = useState<boolean>(false);
  const [pendingPhoneCall, setPendingPhoneCall] = useState<PhoneCall | null>(null);
  const [phoneRinging, setPhoneRinging] = useState<boolean>(false);

  // Modals
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [endingsOpen, setEndingsOpen] = useState<boolean>(false);
  const [mateOpen, setMateOpen] = useState<boolean>(false);
  const [radioOpen, setRadioOpen] = useState<boolean>(false);
  const [tvOpen, setTvOpen] = useState<boolean>(false);
  const [souvenirsOpen, setSouvenirsOpen] = useState<boolean>(false);
  const [trucoOpen, setTrucoOpen] = useState<boolean>(false);
  const [introSuperiorOpen, setIntroSuperiorOpen] = useState<boolean>(false);
  const [storeOpen, setStoreOpen] = useState<boolean>(false);

  // Points & Customization System
  const [puntosGestion, setPuntosGestion] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PUNTOS_GESTION_KEY);
      return saved !== null ? parseInt(saved, 10) : 150; // 150 pts de viáticos iniciales
    } catch {
      return 150;
    }
  });

  // Family Household & Workday Clock System
  const [householdState, setHouseholdState] = useState<FamilyHouseholdState>(() => {
    try {
      const saved = localStorage.getItem(HOUSEHOLD_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_HOUSEHOLD_STATE;
    } catch {
      return INITIAL_HOUSEHOLD_STATE;
    }
  });

  const [workdayMinutes, setWorkdayMinutes] = useState<number>(0);
  const [dayDecisions, setDayDecisions] = useState<DecisionRecord[]>([]);
  const [daySummaryOpen, setDaySummaryOpen] = useState<boolean>(false);

  const [unlockedCustomizations, setUnlockedCustomizations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMIZATIONS_UNLOCKED_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            'theme_nogal_republicano',
            'ink_dual_bicolor',
            'ink_violeta_oficial',
            'fx_vision_limpia',
            'emblem_sol_republicano',
            'folder_manila_clasica'
          ];
    } catch {
      return [
        'theme_nogal_republicano',
        'ink_violeta_oficial',
        'fx_vision_limpia',
        'emblem_sol_republicano',
        'folder_manila_clasica'
      ];
    }
  });

  const [equippedCustomizations, setEquippedCustomizations] = useState<EquippedCustomizations>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMIZATIONS_EQUIPPED_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_EQUIPPED;
    } catch {
      return DEFAULT_EQUIPPED;
    }
  });

  const [pointsNotification, setPointsNotification] = useState<{
    id: number;
    delta: number;
    text: string;
  } | null>(null);

  // Workday Clock & Progress formatting
  const workdayTimeFormatted = useMemo(() => {
    const totalMin = 6 * 60 + workdayMinutes;
    const hour24 = Math.min(21, Math.floor(totalMin / 60));
    const min = hour24 === 21 ? 0 : Math.floor(totalMin % 60);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
    return `${hour12.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${period}`;
  }, [workdayMinutes]);

  const workdayProgress = useMemo(() => {
    return Math.min(100, Math.max(0, (workdayMinutes / 900) * 100));
  }, [workdayMinutes]);

  // Real-time ticking clock effect during active gameplay
  useEffect(() => {
    if (view !== 'playing' || daySummaryOpen) return;
    const interval = setInterval(() => {
      setWorkdayMinutes((prev) => {
        if (prev >= 900) return prev;
        const next = prev + 1;
        if (next >= 900) {
          sound.playEndDayBuzzer();
          setDaySummaryOpen(true);
        }
        return next;
      });
    }, 2400); // 1 min per 2.4s of gameplay
    return () => clearInterval(interval);
  }, [view, daySummaryOpen]);

  // Unlocked Endings & Souvenirs
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(UNLOCKED_ENDINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unlockedSouvenirs, setUnlockedSouvenirs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(UNLOCKED_SOUVENIRS_KEY);
      return saved ? JSON.parse(saved) : ['pinguino_vino'];
    } catch {
      return ['pinguino_vino'];
    }
  });

  const [hasSavedGame, setHasSavedGame] = useState<boolean>(() => {
    return !!localStorage.getItem(SAVE_STORAGE_KEY);
  });

  // Points notification helper
  const addPoints = useCallback((amount: number, reason: string) => {
    setPuntosGestion((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem(PUNTOS_GESTION_KEY, String(next));
      } catch {}
      return next;
    });
    setPointsNotification({ id: Date.now(), delta: amount, text: reason });
    setTimeout(() => {
      setPointsNotification((curr) => (curr?.text === reason ? null : curr));
    }, 2800);
  }, []);

  // Purchase & Equip handlers
  const handleBuyCustomization = useCallback((item: CustomizationItem) => {
    setPuntosGestion((prev) => {
      if (prev < item.cost) return prev;
      const nextPoints = prev - item.cost;
      try {
        localStorage.setItem(PUNTOS_GESTION_KEY, String(nextPoints));
      } catch {}
      return nextPoints;
    });

    setUnlockedCustomizations((prev) => {
      if (prev.includes(item.id)) return prev;
      const next = [...prev, item.id];
      try {
        localStorage.setItem(CUSTOMIZATIONS_UNLOCKED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Auto equip upon buying
    setEquippedCustomizations((prev) => {
      const next = { ...prev, [item.category]: item.id };
      try {
        localStorage.setItem(CUSTOMIZATIONS_EQUIPPED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleEquipCustomization = useCallback((category: CustomizationCategory, itemId: string) => {
    setEquippedCustomizations((prev) => {
      const next = { ...prev, [category]: itemId };
      try {
        localStorage.setItem(CUSTOMIZATIONS_EQUIPPED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Current Card
  const currentCardIndex = deck[deckIndex % deck.length] ?? 0;
  const currentCard = EXPEDIENTES[currentCardIndex] ?? EXPEDIENTES[0];

  // Save game helper
  const persistGame = useCallback(
    (
      currentStats: Stats,
      currentCount: number,
      currentHist: DecisionRecord[],
      curDeck: number[],
      curIndex: number,
      curMate: number,
      curPatrimonio: number,
      curRiesgo: number
    ) => {
      try {
        localStorage.setItem(
          SAVE_STORAGE_KEY,
          JSON.stringify({
            stats: currentStats,
            decisionCount: currentCount,
            history: currentHist,
            deck: curDeck,
            deckIndex: curIndex,
            mateCount: curMate,
            patrimonioDolares: curPatrimonio,
            allanamientoRiesgo: curRiesgo
          })
        );
        setHasSavedGame(true);
      } catch (e) {
        console.warn('No se pudo guardar en localStorage', e);
      }
    },
    []
  );

  const clearSavedGame = useCallback(() => {
    localStorage.removeItem(SAVE_STORAGE_KEY);
    setHasSavedGame(false);
  }, []);

  // Unlock Souvenir
  const unlockSouvenir = useCallback((souvenirId: string) => {
    setUnlockedSouvenirs((prev) => {
      if (!prev.includes(souvenirId)) {
        const next = [...prev, souvenirId];
        try {
          localStorage.setItem(UNLOCKED_SOUVENIRS_KEY, JSON.stringify(next));
        } catch {}
        sound.playUnlock();
        return next;
      }
      return prev;
    });
  }, []);

  // Unlock Ending
  const registerEnding = useCallback((endingId: string) => {
    setUnlockedEndings((prev) => {
      if (!prev.includes(endingId)) {
        const next = [...prev, endingId];
        try {
          localStorage.setItem(UNLOCKED_ENDINGS_KEY, JSON.stringify(next));
        } catch {}
        addPoints(250, '+250 pts: ¡Nuevo final descubierto!');
        return next;
      }
      return prev;
    });
  }, [addPoints]);

  // Start new game with superior induction narrative
  const startNewGame = useCallback(() => {
    clearSavedGame();
    const newStats: Stats = { pueblo: 50, caos: 50, guita: 50, instituciones: 50 };
    const newDeck = shuffleDeck(EXPEDIENTES.length);
    setStats(newStats);
    setDecisionCount(0);
    setPatrimonioDolares(0);
    setAllanamientoRiesgo(0);
    setHistory([]);
    setDeck(newDeck);
    setDeckIndex(0);
    setMateCount(0);
    setActiveDeltas(null);
    setHoverDeltas(null);
    setActiveEnding(null);
    setDecidedExpediente(null);
    setCoimaAccepted(false);
    setPendingPhoneCall(null);
    setPhoneRinging(false);
    setIntroSuperiorOpen(true);
    setWorkdayMinutes(0);
    setDayDecisions([]);
    setHouseholdState(INITIAL_HOUSEHOLD_STATE);
    try {
      localStorage.removeItem(HOUSEHOLD_STORAGE_KEY);
    } catch {}
    setView('playing');
    persistGame(newStats, 0, [], newDeck, 0, 0, 0, 0);
  }, [clearSavedGame, persistGame]);

  // Truco Match Win handler
  const handleTrucoWinMatch = useCallback(
    (withValeCuatro: boolean, had33: boolean) => {
      unlockSouvenir('cartas_truco_oro');
      if (withValeCuatro) {
        unlockSouvenir('facsimil_decreto');
      }
      if (had33) {
        unlockSouvenir('pelota_pulpo');
      }

      addPoints(150, '+150 pts: Victoria en el Truco');

      setPatrimonioDolares((prev) => {
        const next = prev + 15000;
        persistGame(
          stats,
          decisionCount,
          history,
          deck,
          deckIndex,
          mateCount,
          next,
          allanamientoRiesgo
        );
        return next;
      });
    },
    [
      stats,
      decisionCount,
      history,
      deck,
      deckIndex,
      mateCount,
      allanamientoRiesgo,
      unlockSouvenir,
      addPoints,
      persistGame
    ]
  );

  // Continue saved game
  const continueSavedGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(SAVE_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setStats(data.stats);
        setDecisionCount(data.decisionCount);
        setPatrimonioDolares(data.patrimonioDolares || 0);
        setAllanamientoRiesgo(data.allanamientoRiesgo || 0);
        setHistory(data.history || []);
        setDeck(data.deck || shuffleDeck(EXPEDIENTES.length));
        setDeckIndex(data.deckIndex || 0);
        setMateCount(data.mateCount || 0);
        setActiveDeltas(null);
        setHoverDeltas(null);
        setActiveEnding(null);
        setDecidedExpediente(null);
        setCoimaAccepted(false);
        setPendingPhoneCall(null);
        setPhoneRinging(false);
        setView('playing');
      } else {
        startNewGame();
      }
    } catch {
      startNewGame();
    }
  }, [startNewGame]);

  // Currency Exchange: Dolares to Pesos
  const handleExchangeDolaresToPesos = useCallback(
    (amountDolares: number) => {
      if (patrimonioDolares < amountDolares) return;
      const pesosGain = amountDolares * 1350;
      setPatrimonioDolares((prev) => prev - amountDolares);
      setHouseholdState((prev) => {
        const next = { ...prev, pesosEnMano: prev.pesosEnMano + pesosGain };
        try {
          localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
      sound.playCashPaid();
      addPoints(20, `+20 pts: Cambio en cueva ($${amountDolares} USD a ARS)`);
    },
    [patrimonioDolares, addPoints]
  );

  // Nightly budget confirmation & sleep handler
  const handleConfirmBudgetAndSleep = useCallback(
    (budget: {
      payRent: boolean;
      foodChoice: 'full' | 'basic' | 'none';
      payHeating: boolean;
      payMedicine: boolean;
      payEmergency: boolean;
    }) => {
      const foodCost =
        budget.foodChoice === 'full'
          ? HOUSEHOLD_COSTS.foodFull
          : budget.foodChoice === 'basic'
          ? HOUSEHOLD_COSTS.foodBasic
          : 0;
      const rentCost = budget.payRent ? HOUSEHOLD_COSTS.rent : 0;
      const heatCost = budget.payHeating ? HOUSEHOLD_COSTS.heating : 0;
      const medCost = budget.payMedicine ? HOUSEHOLD_COSTS.medicine : 0;
      const emergencyCost =
        householdState.currentEmergency && budget.payEmergency
          ? householdState.currentEmergency.cost
          : 0;

      const totalCost = foodCost + rentCost + heatCost + medCost + emergencyCost;
      const startingPesos = householdState.pesosEnMano + householdState.salaryBase;
      const nextPesos = Math.max(0, startingPesos - totalCost);

      let nextRentUnpaidDays = budget.payRent ? 0 : householdState.rentUnpaidDays + 1;
      let fatalEndingId: string | null = null;

      // 1. Eviction condition (2 days without paying rent)
      if (nextRentUnpaidDays >= 2) {
        fatalEndingId = 'familia_desalojo';
      }

      // 2. Members status evolution
      const nextMembers = householdState.members.map((m) => {
        let hunger = m.hungerDays;
        let sick = m.sickDays;
        let status = m.status;
        let statusText = m.statusText;

        // Food
        if (budget.foodChoice === 'full') {
          hunger = 0;
          if (status === 'hambriento') status = 'sano';
          statusText = 'Cena abundante. Esperanza renovada en el hogar.';
        } else if (budget.foodChoice === 'basic') {
          statusText = 'Polenta con tuco. Apretando el cinturón pero con vida.';
        } else {
          hunger += 1;
          if (hunger >= 2 && status === 'sano') status = 'hambriento';
          if (hunger >= 3) status = 'critico';
          statusText = 'Se fue a dormir con hambre y mate cocido.';
        }

        // Heating
        if (!budget.payHeating && status !== 'fallecido') {
          if (Math.random() < 0.55) {
            sick += 1;
            status = 'enfermo';
            statusText = 'Frío polar en la casa. Tos convulsa y fiebre.';
          }
        }

        // Medicine
        if (budget.payMedicine) {
          if (status === 'enfermo' || status === 'critico') {
            status = 'sano';
            sick = 0;
            statusText = 'Medicamentos administrados con éxito. Salud estabilizada.';
          }
        } else {
          if (status === 'enfermo' || status === 'critico') {
            sick += 1;
            if (m.id === 'abuela' && sick >= 2) {
              status = 'fallecido';
              statusText = 'No resistió sin la medicación cardiológica.';
              fatalEndingId = 'familia_tragedia';
            }
          }
        }

        // Gladys abandonment check
        if (m.id === 'esposa' && hunger >= 3) {
          status = 'abandonado';
          fatalEndingId = 'familia_abandono';
        }

        return {
          ...m,
          hungerDays: hunger,
          sickDays: sick,
          status,
          statusText
        };
      });

      // Special Prosperity Ending check (high wealth + day >= 3 + intact family)
      if (patrimonioDolares >= 60000 && householdState.day >= 3 && !fatalEndingId) {
        fatalEndingId = 'familia_prospera';
      }

      // Next Emergency Event
      const nextEmergency =
        Math.random() < 0.45
          ? FAMILY_EMERGENCIES[Math.floor(Math.random() * FAMILY_EMERGENCIES.length)]
          : null;

      const nextHousehold: FamilyHouseholdState = {
        day: householdState.day + 1,
        pesosEnMano: nextPesos,
        salaryBase: householdState.salaryBase,
        rentUnpaidDays: nextRentUnpaidDays,
        evictionWarning: nextRentUnpaidDays > 0,
        members: nextMembers,
        currentEmergency: nextEmergency
      };

      setHouseholdState(nextHousehold);
      try {
        localStorage.setItem(HOUSEHOLD_STORAGE_KEY, JSON.stringify(nextHousehold));
      } catch {}

      setDayDecisions([]);
      setWorkdayMinutes(0);
      setDaySummaryOpen(false);

      if (fatalEndingId && ENDINGS[fatalEndingId]) {
        const ending = ENDINGS[fatalEndingId];
        registerEnding(ending.id);
        setActiveEnding(ending);
        clearSavedGame();
        setView('ending');
        return;
      }

      sound.playCashPaid();
      addPoints(50, `+50 pts: ¡Día ${householdState.day} sobrevivido con la familia!`);
    },
    [householdState, patrimonioDolares, addPoints, registerEnding, clearSavedGame]
  );

  // Check ending condition
  const checkEnding = useCallback((currentStats: Stats, count: number): Ending | null => {
    if (currentStats.pueblo <= 0) return ENDINGS.pueblo_low;
    if (currentStats.pueblo >= 100) return ENDINGS.pueblo_high;
    if (currentStats.caos >= 100) return ENDINGS.caos_high;
    if (currentStats.caos <= 0) return ENDINGS.caos_low;
    if (currentStats.guita <= 0) return ENDINGS.guita_low;
    if (currentStats.guita >= 100) return ENDINGS.guita_high;
    if (currentStats.instituciones <= 0) return ENDINGS.instituciones_low;
    if (currentStats.instituciones >= 100) return ENDINGS.instituciones_high;

    // Victory or retirement endings
    const allBalanced = Object.keys(STAT_CONFIG).every(
      (k) => currentStats[k as StatKey] >= 25 && currentStats[k as StatKey] <= 75
    );
    if (count >= 50 && allBalanced) return ENDINGS.balanced;
    if (count >= 35 && allBalanced) return ENDINGS.resign;

    return null;
  }, []);

  // Handle Decision (Approve or Reject)
  const handleDecision = useCallback(
    (approved: boolean) => {
      if (view !== 'playing') return;

      const cardBeingDecided = currentCard;
      setDecidedExpediente(cardBeingDecided);
      sound.playStamp(approved);
      setCurrentApproved(approved);
      setView('stamping');
      setHoverDeltas(null);

      const deltas = approved ? cardBeingDecided.a : cardBeingDecided.r;
      const text = approved ? cardBeingDecided.ca : cardBeingDecided.cr;
      const quote = approved ? cardBeingDecided.cq : cardBeingDecided.cq_r;

      // Points reward
      addPoints(10, '+10 pts: Trámite despachado');

      // Advance workday clock
      setWorkdayMinutes((prev) => {
        const next = prev + 115;
        if (next >= 900) {
          sound.playEndDayBuzzer();
        }
        return next;
      });

      // Check coima addition
      let addedPatrimonio = 0;
      let addedRiesgo = 0;
      if (cardBeingDecided.coima && coimaAccepted) {
        addedPatrimonio = cardBeingDecided.coima.montoDolares;
        addedRiesgo = cardBeingDecided.coima.riesgoAllanamientos;
        unlockSouvenir('valija_dolares');
        addPoints(25, '+25 pts: Viático bajo la mesa');
      }

      setTimeout(() => {
        const nextStats: Stats = {
          pueblo: clamp(stats.pueblo + (deltas.pueblo || 0)),
          caos: clamp(stats.caos + (deltas.caos || 0)),
          guita: clamp(stats.guita + (deltas.guita || 0)),
          instituciones: clamp(stats.instituciones + (deltas.instituciones || 0))
        };

        const nextCount = decisionCount + 1;
        const nextPatrimonio = patrimonioDolares + addedPatrimonio;
        const nextRiesgo = clamp(allanamientoRiesgo + addedRiesgo);

        if (nextCount % 5 === 0) {
          addPoints(50, '+50 pts: Bono semana laboral cumplida');
        }

        const newRecord: DecisionRecord = {
          expedienteId: cardBeingDecided.id,
          numero: cardBeingDecided.numero,
          caratula: cardBeingDecided.caratula,
          solicitante: cardBeingDecided.solicitante,
          asunto: cardBeingDecided.asunto,
          rubro: cardBeingDecided.rubro,
          decision: approved ? 'aprobado' : 'rechazado',
          consecuencia: text,
          cita: quote,
          deltas: deltas,
          statsAfter: nextStats,
          timestamp: new Date().toLocaleTimeString('es-AR'),
          coimaAceptada: coimaAccepted,
          montoCoima: addedPatrimonio
        };

        const nextHistory = [newRecord, ...history];

        setStats(nextStats);
        setActiveDeltas(deltas);
        setDecisionCount(nextCount);
        setPatrimonioDolares(nextPatrimonio);
        setAllanamientoRiesgo(nextRiesgo);
        setHistory(nextHistory);
        setDayDecisions((prev) => [newRecord, ...prev]);

        // Check Souvenir unlocks
        if (nextStats.caos >= 85) {
          unlockSouvenir('estampita_gauchito');
        }
        if (nextCount >= 10 && nextStats.pueblo >= 65) {
          unlockSouvenir('pinguino_vino');
        }
        if (cardBeingDecided.rubro.includes('Cultura') || cardBeingDecided.asunto.includes('Murga')) {
          unlockSouvenir('banderin_club');
        }

        // Trigger phone calls dynamically at key moments (every 5 decisions or critical chaos/money)
        if (nextCount % 5 === 0 || nextStats.caos >= 80 || nextRiesgo >= 50) {
          const randomCall = PHONE_CALLS[Math.floor(Math.random() * PHONE_CALLS.length)];
          setPendingPhoneCall(randomCall);
          setPhoneRinging(true);
          sound.playPhoneRing();
        }

        persistGame(
          nextStats,
          nextCount,
          nextHistory,
          deck,
          deckIndex,
          mateCount,
          nextPatrimonio,
          nextRiesgo
        );
        setView('consequence');
      }, 550);
    },
    [
      view,
      currentCard,
      stats,
      decisionCount,
      patrimonioDolares,
      allanamientoRiesgo,
      coimaAccepted,
      history,
      deck,
      deckIndex,
      mateCount,
      unlockSouvenir,
      addPoints,
      persistGame
    ]
  );

  // Proceed to next card or ending or end of workday
  const handleNextExpediente = useCallback(() => {
    setActiveDeltas(null);
    setCoimaAccepted(false);

    // If workday ended (reaches 21:00 / 9 PM), show Day Summary & Family screen!
    if (workdayMinutes >= 900) {
      sound.playEndDayBuzzer();
      setDaySummaryOpen(true);
      return;
    }

    // If phone is ringing, show phone modal first!
    if (phoneRinging && pendingPhoneCall) {
      setPhoneOpen(true);
      return;
    }

    const ending = checkEnding(stats, decisionCount);
    if (ending) {
      registerEnding(ending.id);
      if (ending.id === 'balanced' || ending.id === 'resign') {
        unlockSouvenir('placa_bronce');
      }
      setActiveEnding(ending);
      clearSavedGame();
      setView('ending');
    } else {
      const nextDeckIndex = deckIndex + 1;
      setDeckIndex(nextDeckIndex);
      setDecidedExpediente(null);
      persistGame(
        stats,
        decisionCount,
        history,
        deck,
        nextDeckIndex,
        mateCount,
        patrimonioDolares,
        allanamientoRiesgo
      );

      // Re-shuffle if we exhausted the deck
      if (nextDeckIndex >= deck.length) {
        setDeck(shuffleDeck(EXPEDIENTES.length));
        setDeckIndex(0);
      }
      setView('playing');
    }
  }, [
    workdayMinutes,
    phoneRinging,
    pendingPhoneCall,
    stats,
    decisionCount,
    history,
    deck,
    deckIndex,
    mateCount,
    patrimonioDolares,
    allanamientoRiesgo,
    checkEnding,
    registerEnding,
    unlockSouvenir,
    clearSavedGame,
    persistGame
  ]);

  // Handle Phone Call Resolution
  const handlePhoneAnswer = useCallback(
    (optionIndex: number) => {
      if (!pendingPhoneCall) return;
      const option = pendingPhoneCall.opciones[optionIndex];
      if (!option) return;

      const nextStats: Stats = {
        pueblo: clamp(stats.pueblo + (option.deltas.pueblo || 0)),
        caos: clamp(stats.caos + (option.deltas.caos || 0)),
        guita: clamp(stats.guita + (option.deltas.guita || 0)),
        instituciones: clamp(stats.instituciones + (option.deltas.instituciones || 0))
      };

      const nextPatrimonio = patrimonioDolares + (option.patrimonioDelta || 0);

      // Log decision record from phone call
      const newRecord: DecisionRecord = {
        expedienteId: pendingPhoneCall.id,
        numero: 9900 + decisionCount,
        caratula: `TEL-${pendingPhoneCall.callerTitle.toUpperCase()}`,
        solicitante: pendingPhoneCall.callerName,
        asunto: `Llamada Secreta: ${option.texto}`,
        rubro: 'Teléfono Rojo Presidencial',
        decision: 'aprobado',
        consecuencia: option.consecuencia,
        cita: option.cita,
        deltas: option.deltas,
        statsAfter: nextStats,
        timestamp: new Date().toLocaleTimeString('es-AR'),
        montoCoima: option.patrimonioDelta
      };

      setStats(nextStats);
      setPatrimonioDolares(nextPatrimonio);
      setHistory([newRecord, ...history]);
      setPhoneRinging(false);
      setPhoneOpen(false);
      setPendingPhoneCall(null);

      persistGame(
        nextStats,
        decisionCount,
        [newRecord, ...history],
        deck,
        deckIndex,
        mateCount,
        nextPatrimonio,
        allanamientoRiesgo
      );

      const ending = checkEnding(nextStats, decisionCount);
      if (ending) {
        registerEnding(ending.id);
        setActiveEnding(ending);
        clearSavedGame();
        setView('ending');
      } else {
        setView('playing');
      }
    },
    [
      pendingPhoneCall,
      stats,
      decisionCount,
      patrimonioDolares,
      history,
      deck,
      deckIndex,
      mateCount,
      allanamientoRiesgo,
      checkEnding,
      registerEnding,
      clearSavedGame,
      persistGame
    ]
  );

  // Cebar mate
  const handleCebarMate = useCallback(() => {
    addPoints(15, '+15 pts: Mate cebado');
    setMateCount((prev) => {
      const next = prev + 1;
      if (next >= 10) {
        unlockSouvenir('mate_alpaca');
      }
      persistGame(
        stats,
        decisionCount,
        history,
        deck,
        deckIndex,
        next,
        patrimonioDolares,
        allanamientoRiesgo
      );
      return next;
    });
  }, [stats, decisionCount, history, deck, deckIndex, patrimonioDolares, allanamientoRiesgo, unlockSouvenir, addPoints, persistGame]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        historyOpen ||
        endingsOpen ||
        mateOpen ||
        radioOpen ||
        tvOpen ||
        phoneOpen ||
        souvenirsOpen ||
        trucoOpen ||
        storeOpen
      ) {
        return;
      }

      if (view === 'playing') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleDecision(false);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleDecision(true);
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          if (phoneRinging && pendingPhoneCall) {
            setPhoneOpen(true);
          } else {
            setSouvenirsOpen(true);
          }
        } else if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          sound.playTvStinger();
          setTvOpen(true);
        } else if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          setMateOpen(true);
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          setRadioOpen(true);
        } else if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setHistoryOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    view,
    historyOpen,
    endingsOpen,
    mateOpen,
    radioOpen,
    tvOpen,
    phoneOpen,
    souvenirsOpen,
    trucoOpen,
    storeOpen,
    phoneRinging,
    pendingPhoneCall,
    handleDecision
  ]);

  const totalEndingsCount = Object.keys(ENDINGS).length;

  // Environmental dynamic office deterioration styling based on Chaos & Arcas
  const deskChaosOverlay = useMemo(() => {
    if (stats.caos >= 75) return 'shadow-[inset_0_0_80px_rgba(165,51,58,0.35)]';
    if (stats.guita <= 25) return 'shadow-[inset_0_0_80px_rgba(36,48,58,0.45)]';
    if (stats.pueblo >= 75) return 'shadow-[inset_0_0_80px_rgba(60,110,71,0.25)]';
    return '';
  }, [stats]);

  // Dynamic Theme Styling
  const themeBgClasses = useMemo(() => {
    switch (equippedCustomizations.desk_theme) {
      case 'theme_caoba_presidencial':
        return 'bg-[#220d0f] text-[#F3E7DC]';
      case 'theme_formica_1974':
        return 'bg-[#152018] text-[#E2ECE0]';
      case 'theme_medianoche_cyber':
        return 'bg-[#0b141f] text-[#DCE7F2]';
      case 'theme_prensa_grafica':
        return 'bg-[#121212] text-[#E0E0E0]';
      case 'theme_marmol_palaciego':
        return 'bg-[#1a2129] text-[#EDF2F7]';
      case 'theme_nogal_republicano':
      default:
        return 'bg-[#181a1b] text-[#EDE6D3]';
    }
  }, [equippedCustomizations.desk_theme]);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-3 sm:p-5 relative font-sans selection:bg-[#6CACE4] selection:text-black overflow-x-hidden transition-all duration-700 ${themeBgClasses} ${deskChaosOverlay}`}
    >
      {/* Background Subtle Paper Texture Gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#24303A] via-[#181a1b] to-[#10171d]"></div>

      {/* Screen Effects / CRT scanlines, sepia, sodium glow */}
      {equippedCustomizations.screen_fx === 'fx_crt_scanlines' && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.28)_50%)] bg-[length:100%_4px] opacity-35" />
      )}
      {equippedCustomizations.screen_fx === 'fx_sepia_archivo' && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-amber-950/15 backdrop-sepia-[0.35] backdrop-brightness-95" />
      )}
      {equippedCustomizations.screen_fx === 'fx_sodio_nocturno' && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-amber-500/5 shadow-[inset_0_0_120px_rgba(217,119,6,0.2)]" />
      )}
      {equippedCustomizations.screen_fx === 'fx_fotocopia_minolta' && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-black/5 backdrop-contrast-105 opacity-80" />
      )}

      {/* Floating Points Notification */}
      {pointsNotification && (
        <div className="fixed top-4 right-4 z-50 bg-[#161c22]/95 border-2 border-[#FFEAA7] text-[#FFEAA7] font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xl animate-[bounce_0.6s_ease-out] flex items-center gap-2 pointer-events-none">
          <span className="text-base">🪙</span>
          <span>{pointsNotification.text}</span>
        </div>
      )}

      {/* Extreme Chaos Smoke / Protest ambient effect */}
      {stats.caos >= 75 && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-red-950/15 backdrop-brightness-95 animate-pulse" />
      )}

      {/* Main App Container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex-1 flex flex-col">
        {/* Header (shown in playing, stamping, and consequence views) */}
        {view !== 'menu' && (
          <DeskHeader
            decisionCount={decisionCount}
            unlockedEndingsCount={unlockedEndings.length}
            totalEndingsCount={totalEndingsCount}
            patrimonioDolares={patrimonioDolares}
            unlockedSouvenirsCount={unlockedSouvenirs.length}
            totalSouvenirsCount={SOUVENIRS.length}
            phoneRinging={phoneRinging}
            puntosGestion={puntosGestion}
            deskEmblemId={equippedCustomizations.desk_emblem}
            workdayTime={workdayTimeFormatted}
            workdayProgress={workdayProgress}
            dayNumber={householdState.day}
            pesosEnMano={householdState.pesosEnMano}
            onOpenHistory={() => setHistoryOpen(true)}
            onOpenEndings={() => setEndingsOpen(true)}
            onOpenMate={() => setMateOpen(true)}
            onOpenRadio={() => setRadioOpen(true)}
            onOpenTv={() => setTvOpen(true)}
            onOpenSouvenirs={() => setSouvenirsOpen(true)}
            onOpenTruco={() => setTrucoOpen(true)}
            onOpenStore={() => setStoreOpen(true)}
            onOpenPhone={() => {
              if (phoneRinging && pendingPhoneCall) {
                setPhoneOpen(true);
              } else {
                setSouvenirsOpen(true);
              }
            }}
            mateCount={mateCount}
          />
        )}

        {/* Meters Bar (shown in playing, stamping, and consequence views) */}
        {view !== 'menu' && view !== 'ending' && (
          <MetersBar stats={stats} deltas={activeDeltas} hoverDeltas={hoverDeltas} />
        )}

        {/* Main Stage Switcher */}
        <main className="flex-1 flex flex-col justify-center items-center py-2 relative">
          {view === 'menu' && (
            <MenuScreen
              hasSavedGame={hasSavedGame}
              savedDecisionCount={decisionCount}
              unlockedEndingsCount={unlockedEndings.length}
              totalEndingsCount={totalEndingsCount}
              puntosGestion={puntosGestion}
              onContinue={continueSavedGame}
              onNewGame={startNewGame}
              onDeleteSave={clearSavedGame}
              onOpenEndings={() => setEndingsOpen(true)}
              onOpenRadio={() => setRadioOpen(true)}
              onOpenTv={() => setTvOpen(true)}
              onOpenStore={() => setStoreOpen(true)}
            />
          )}

          {(view === 'playing' || view === 'stamping') && (
            <div className="relative w-full">
              <ExpedienteCard
                expediente={currentCard}
                index={deckIndex}
                totalDecisions={decisionCount}
                coimaAccepted={coimaAccepted}
                folderColorId={equippedCustomizations.folder_color}
                stampInkId={equippedCustomizations.stamp_ink}
                onToggleCoima={setCoimaAccepted}
                onApprove={() => handleDecision(true)}
                onReject={() => handleDecision(false)}
                onHoverAction={setHoverDeltas}
              />
              {view === 'stamping' && (
                <ImpactStampOverlay
                  approved={currentApproved}
                  stampInkId={equippedCustomizations.stamp_ink}
                />
              )}
            </div>
          )}

          {view === 'consequence' && (
            <ConsequenceModal
              expediente={decidedExpediente || currentCard}
              approved={currentApproved}
              onNext={handleNextExpediente}
            />
          )}

          {view === 'ending' && activeEnding && (
            <EndingScreen
              ending={activeEnding}
              stats={stats}
              decisionCount={decisionCount}
              mateCount={mateCount}
              onRestart={startNewGame}
              onOpenHistory={() => setHistoryOpen(true)}
              onOpenEndings={() => setEndingsOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      {historyOpen && <HistoryDrawer history={history} onClose={() => setHistoryOpen(false)} />}
      {endingsOpen && (
        <EndingsModal
          unlockedEndings={unlockedEndings}
          onClose={() => setEndingsOpen(false)}
        />
      )}
      {mateOpen && (
        <MateModal
          mateCount={mateCount}
          onCebarMate={handleCebarMate}
          onClose={() => setMateOpen(false)}
        />
      )}
      {radioOpen && <RadioModal onClose={() => setRadioOpen(false)} />}
      {tvOpen && <TvModal history={history} onClose={() => setTvOpen(false)} />}
      {souvenirsOpen && (
        <SouvenirsModal
          unlockedSouvenirs={unlockedSouvenirs}
          patrimonioDolares={patrimonioDolares}
          allanamientoRiesgo={allanamientoRiesgo}
          onOpenTruco={() => {
            setSouvenirsOpen(false);
            setTrucoOpen(true);
          }}
          onClose={() => setSouvenirsOpen(false)}
        />
      )}
      {trucoOpen && (
        <TrucoModal
          onWinMatch={handleTrucoWinMatch}
          onClose={() => setTrucoOpen(false)}
        />
      )}
      {introSuperiorOpen && (
        <IntroSuperiorModal
          onFinish={() => setIntroSuperiorOpen(false)}
        />
      )}
      {storeOpen && (
        <StoreModal
          puntosGestion={puntosGestion}
          unlockedCustomizations={unlockedCustomizations}
          equippedCustomizations={equippedCustomizations}
          onBuyItem={handleBuyCustomization}
          onEquipItem={handleEquipCustomization}
          onClose={() => setStoreOpen(false)}
        />
      )}
      {phoneOpen && pendingPhoneCall && (
        <PhoneModal
          phoneCall={pendingPhoneCall}
          onAnswer={handlePhoneAnswer}
          onIgnore={() => {
            setPhoneOpen(false);
            setPhoneRinging(false);
            setPendingPhoneCall(null);
          }}
        />
      )}
      {daySummaryOpen && (
        <DaySummaryFamilyModal
          dayNumber={householdState.day}
          dayDecisions={dayDecisions}
          patrimonioDolares={patrimonioDolares}
          householdState={householdState}
          onExchangeDolaresToPesos={handleExchangeDolaresToPesos}
          onConfirmBudgetAndSleep={handleConfirmBudgetAndSleep}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-2 text-[10px] font-mono text-[#8B98A5] select-none">
        República Argentina · Ministerio de Trámites Varios · Versión Oficial 4.0 Pro
      </footer>
    </div>
  );
}


