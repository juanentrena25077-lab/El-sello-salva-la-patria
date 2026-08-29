import { FamilyMember, FamilyEmergencyEvent, FamilyHouseholdState } from '../types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'esposa',
    name: 'Gladys',
    role: 'Tu compañera de toda la vida',
    avatar: '👩‍🦱',
    status: 'sano',
    statusText: 'Haciendo malabares con la lista del súper chino.',
    hungerDays: 0,
    sickDays: 0
  },
  {
    id: 'hijo',
    name: 'Braian Tiago',
    role: 'Tu hijo de 9 años (va a 4to grado)',
    avatar: '👦',
    status: 'sano',
    statusText: 'Dibujando un auto volador con crayones gastados.',
    hungerDays: 0,
    sickDays: 0
  },
  {
    id: 'abuela',
    name: 'Nona Haydée',
    role: 'Tu suegra jubilada (mínima de ANSES)',
    avatar: '👵',
    status: 'sano',
    statusText: 'Tejiendo una bufanda mientras reniega con el PAMI.',
    hungerDays: 0,
    sickDays: 0
  }
];

export const INITIAL_HOUSEHOLD_STATE: FamilyHouseholdState = {
  day: 1,
  pesosEnMano: 45000, // Ahorro inicial modesto
  salaryBase: 35000,  // Sueldo básico estatal diario
  rentUnpaidDays: 0,
  evictionWarning: false,
  members: INITIAL_MEMBERS,
  currentEmergency: null
};

export const HOUSEHOLD_COSTS = {
  rent: 22000,
  foodFull: 16000,
  foodBasic: 6000,
  foodNone: 0,
  heating: 8000,
  medicine: 11000
};

export const FAMILY_EMERGENCIES: FamilyEmergencyEvent[] = [
  {
    id: 'calefon_roto',
    title: 'Se pinchó el calefón Eslabón de Lujo 1989',
    description: 'El plomero del barrio te cobra los repuestos o se bañan todos con agua helada de la canilla.',
    cost: 18000,
    targetMemberId: 'casa',
    consequenceIfNotPaid: 'Toda la familia pasó la noche con frío polar. Riesgo alto de gripe.',
    icon: '🔧'
  },
  {
    id: 'zapatillas_nene',
    title: 'Zapatillas del nene con agujero en la suela',
    description: 'Braian volvió llorando de la escuela porque se le moja la media con el charco del patio.',
    cost: 15000,
    targetMemberId: 'hijo',
    consequenceIfNotPaid: 'Braian tuvo que faltar al colegio y está con fiebre por caminar con los pies empapados.',
    icon: '👟'
  },
  {
    id: 'remedios_abuela_cardio',
    title: 'Receta cardiológica de la Nona no cubierta por PAMI',
    description: 'La farmacia de la esquina avisa que el laboratorio no entrega las pastillas de la presión.',
    cost: 21000,
    targetMemberId: 'abuela',
    consequenceIfNotPaid: 'La presión arterial de la Nona se disparó a 19/11. Estado sumamente frágil.',
    icon: '💊'
  },
  {
    id: 'deuda_almacen',
    title: 'Fiado en la libreta del almacén de Don Tito',
    description: 'Don Tito te cruza en la vereda y te pide por favor liquidar lo del queso y los fideos.',
    cost: 14000,
    targetMemberId: 'esposa',
    consequenceIfNotPaid: 'Don Tito te cortó el fiado con escándalo vecinal. Gladys no quiere salir a la calle de la vergüenza.',
    icon: '📓'
  },
  {
    id: 'dentista_urgente',
    title: 'Muela de juicio inflamada de Gladys',
    description: 'Gladys lleva 3 noches sin dormir con paños de vinagre y un dolor insoportable.',
    cost: 25000,
    targetMemberId: 'esposa',
    consequenceIfNotPaid: 'La infección se complicó y Gladys cayó en cama con 39º de fiebre.',
    icon: '🦷'
  },
  {
    id: 'cooperadora_escolar',
    title: 'Bono de cooperadora y fotocopias de Geografía',
    description: 'La maestra pide el cuadernillo de mapas de la República Argentina y un litro de lavandina.',
    cost: 9000,
    targetMemberId: 'hijo',
    consequenceIfNotPaid: 'Braian se quedó sin material didáctico y lo mandaron a sentarse al fondo.',
    icon: '📚'
  },
  {
    id: 'garrafa_aumento',
    title: 'Paro de camioneros: Garrafa de gas a precio blue',
    description: 'El camión no pasa y el único que tiene garrafas en el barrio te pide recargo en efectivo.',
    cost: 16000,
    targetMemberId: 'casa',
    consequenceIfNotPaid: 'La casa es una heladera. Hay que dormir vestidos con campera de pluma.',
    icon: '🔥'
  }
];
