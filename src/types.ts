export type StatKey = 'pueblo' | 'caos' | 'guita' | 'instituciones';

export interface Stats {
  pueblo: number;
  caos: number;
  guita: number;
  instituciones: number;
}

export interface StatInfo {
  name: string;
  shortName: string;
  icon: string;
  description: string;
  dangerLow: string;
  dangerHigh: string;
  color: string;
}

export interface Expediente {
  id: string;
  numero: number;
  caratula: string;
  solicitante: string;
  organismo: string;
  rubro: string;
  asunto: string;
  visto_y_considerando: string;
  letra_chica?: string;
  nota_asesor: string;
  urgente?: boolean;
  placaRoja?: string;
  a: Partial<Record<StatKey, number>>; // Efectos Aprobar
  ca: string; // Consecuencia Aprobar
  cq: string; // Cita/Medio Aprobar
  r: Partial<Record<StatKey, number>>; // Efectos Rechazar
  cr: string; // Consecuencia Rechazar
  cq_r: string; // Cita/Medio Rechazar
  // Extensiones nuevas
  coima?: {
    montoDolares: number;
    descripcion: string;
    remitente: string;
    riesgoAllanamientos: number;
  };
  cadenaSiguienteId?: string; // Si se aprueba, dispara este expediente futuro
  cadenaSiguienteIdRechazo?: string; // Si se rechaza, dispara este otro
}

export interface PhoneCall {
  id: string;
  callerName: string;
  callerTitle: string;
  callerAvatar: string;
  dialogue: string;
  triggerCondition: string; // Descripción del por qué llama
  opciones: {
    texto: string;
    deltas: Partial<Record<StatKey, number>>;
    patrimonioDelta?: number;
    consecuencia: string;
    cita: string;
  }[];
}

export interface Souvenir {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
  howToUnlock: string;
}

export interface DecisionRecord {
  expedienteId: string;
  numero: number;
  caratula: string;
  solicitante: string;
  asunto: string;
  rubro: string;
  decision: 'aprobado' | 'rechazado';
  consecuencia: string;
  cita: string;
  deltas: Partial<Record<StatKey, number>>;
  statsAfter: Stats;
  timestamp: string;
  coimaAceptada?: boolean;
  montoCoima?: number;
}

export interface GameState {
  stats: Stats;
  decisionCount: number;
  patrimonioDolares: number;
  allanamientoRiesgo: number;
  history: DecisionRecord[];
  deck: number[];
  deckIndex: number;
  unlockedEndings: string[];
  unlockedSouvenirs: string[];
  mateCount: number;
  pendingPhoneCall?: PhoneCall | null;
  lastDecision?: {
    card: Expediente;
    approved: boolean;
    deltas: Partial<Record<StatKey, number>>;
  };
}

export interface Ending {
  id: string;
  title: string;
  stamp: string;
  badge: string;
  subtitle: string;
  description: string;
  quote: string;
  condition: (stats: Stats, decisionCount: number) => boolean;
}

export type CustomizationCategory =
  | 'desk_theme'
  | 'stamp_ink'
  | 'screen_fx'
  | 'desk_emblem'
  | 'folder_color';

export interface CustomizationItem {
  id: string;
  name: string;
  category: CustomizationCategory;
  cost: number;
  description: string;
  previewColor: string;
  previewIcon: string;
  tag?: string;
}

export interface EquippedCustomizations {
  desk_theme: string;
  stamp_ink: string;
  screen_fx: string;
  desk_emblem: string;
  folder_color: string;
}

export type FamilyMemberStatus = 'sano' | 'hambriento' | 'enfermo' | 'critico' | 'fallecido' | 'abandonado';

export interface FamilyMember {
  id: 'esposa' | 'hijo' | 'abuela';
  name: string;
  role: string;
  avatar: string;
  status: FamilyMemberStatus;
  statusText: string;
  hungerDays: number;
  sickDays: number;
}

export interface FamilyEmergencyEvent {
  id: string;
  title: string;
  description: string;
  cost: number;
  targetMemberId?: 'esposa' | 'hijo' | 'abuela' | 'casa';
  consequenceIfNotPaid: string;
  icon: string;
}

export interface FamilyHouseholdState {
  day: number;
  pesosEnMano: number;
  salaryBase: number;
  rentUnpaidDays: number; // if >= 2, eviction
  evictionWarning: boolean;
  members: FamilyMember[];
  currentEmergency?: FamilyEmergencyEvent | null;
}

export interface DayDecisionsHistory {
  day: number;
  expedientesCount: number;
  coimasCount: number;
  coimasTotal: number;
  salaryEarned: number;
  decisions: DecisionRecord[];
}


