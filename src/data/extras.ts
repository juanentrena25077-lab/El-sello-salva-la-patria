import { PhoneCall, Souvenir } from '../types';

export const PHONE_CALLS: PhoneCall[] = [
  {
    id: 'call_presidente_urgente',
    callerName: 'Dr. Alberto Balcarce',
    callerTitle: 'Presidente de la Nación',
    callerAvatar: '🏛️',
    triggerCondition: 'El Caos o la Burocracia están fuera de control',
    dialogue: '¡Querido Ministro! Te llamo desde el helicóptero. El Obelisco está tapado de humo y el FMI me está mandando stickers de payasos por Telegram. ¡Necesito que me dibujes un informe diciendo que el PBI creció un 14% o me renuncian todos los secretarios antes de las 18!',
    opciones: [
      {
        texto: '«Señor Presidente, quédese tranquilo: ya dibujo los gráficos con pastel de colores y le metemos feriado mañana.»',
        deltas: { pueblo: 8, guita: -5, caos: -6, instituciones: -4 },
        patrimonioDelta: 5000,
        consecuencia: 'El Presidente da una conferencia con los gráficos inventados. El dólar se calma 24 horas y te transfiere un bono de fidelidad a una cuenta en Montevideo.',
        cita: 'Cadena Nacional: "Los números demuestran que somos el país más feliz de América Latina."'
      },
      {
        texto: '«Con todo respeto, Presidente: no podemos tapar el sol con la mano. Hay que aguantar los trapos con la verdad.»',
        deltas: { pueblo: -6, caos: 8, instituciones: 6 },
        patrimonioDelta: 0,
        consecuencia: 'El Presidente te corta furioso tirando el auricular. La oposición aplaude tu rigidez pero el microcentro explota en piquetes.',
        cita: 'Tuit presidencial a las 2:15 AM: "Algunos ministros confunden principios con falta de cintura política."'
      }
    ]
  },
  {
    id: 'call_lider_sindical',
    callerName: 'Hugo "El Camión" Moyanelli',
    callerTitle: 'Secretario General de la CGT Unificada',
    callerAvatar: '🚚',
    triggerCondition: 'Reclamo salarial y tensión en la calle',
    dialogue: '¡Escuchame una cosa, Ministro! Tengo 4.000 camiones con acoplado parados en el peaje de Hudson y la muchachada ya prendió las parrillas con 800 chorizos. Si para el mediodía no sale la homologación de la paritaria al 180% con plus por lluvia y matecocido, no entra ni un sándwich de miga a la Capital.',
    opciones: [
      {
        texto: '«Hugo querido, firmamos todo con retroactivo a marzo y te mandamos dos cajas de yerba especial al gremio.»',
        deltas: { pueblo: 6, guita: -9, caos: -8, instituciones: -3 },
        patrimonioDelta: 10000,
        consecuencia: 'Los camiones tocan bocina festejando por la autopista. Los camioneros te mandan un lechón asado de 25 kilos con una campera de cuero bordada.',
        cita: 'Moyanelli en rueda de prensa: "Este ministro sí tiene sensibilidad popular, no como los tecnócratas de traje."'
      },
      {
        texto: '«Ni lo sueñes, Hugo. Las cuentas del Estado no dan para pagar aumentos astronómicos. Cortá donde quieras.»',
        deltas: { pueblo: -8, caos: 12, guita: 6, instituciones: 4 },
        patrimonioDelta: 0,
        consecuencia: 'Paro total por 72 horas. La recolección de basura se detiene y la 9 de Julio parece un estacionamiento de camiones frigoríficos.',
        cita: 'Zócalo de TV: "BLOQUEO TOTAL: NO HAY COMIDA, NO HAY NAFTA Y NO HAY DIÁLOGO."'
      }
    ]
  },
  {
    id: 'call_enviada_fmi',
    callerName: 'Kristalina Von Schmidt',
    callerTitle: 'Directora de Misión del FMI para el Cono Sur',
    callerAvatar: '💼',
    triggerCondition: 'Falta de reservas y default inminente',
    dialogue: 'Guten Tag, Herr Minister. We are looking at your Central Bank reserves and it seems you have spent the entire contingency fund on dulce de leche, murgas, and drones that fly with empanadas. If you do not apply an immediate 40% shock therapy on public spending, we will cancel the next disbursement of 4 billion dollars.',
    opciones: [
      {
        texto: '«Distinguida Kristalina: le prometo un ajuste fiscal impecable pero déjeme invitarla a un asado en San Telmo para negociar.»',
        deltas: { pueblo: -7, guita: 12, caos: 6, instituciones: 4 },
        patrimonioDelta: 15000,
        consecuencia: 'El FMI gira el tramo de auxilio. La enviada prueba el bife de chorizo y se lleva tres cajas de alfajores en su valija diplomática.',
        cita: 'Comunicado de Washington: "Las metas fiscales son duras pero el chimichurri argentino es de clase mundial."'
      },
      {
        texto: '«Mire doña, en este país se come asado y se ceba mate. No aceptamos órdenes del hemisferio norte.»',
        deltas: { pueblo: 10, guita: -14, caos: -3, instituciones: -6 },
        patrimonioDelta: 0,
        consecuencia: 'Se rompen las negociaciones. El riesgo país sube 400 puntos pero en las plazas te aplauden con banderas argentinas.',
        cita: 'Portada de diarios financieros: "ARGENTINA DESAFÍA A LOS ACREEDORES CON ORGULLO CRIOLLO."'
      }
    ]
  },
  {
    id: 'call_juez_federal',
    callerName: 'Dr. Rodolfo Bonadío-Oyarbide',
    callerTitle: 'Juez Federal de Comodoro Py',
    callerAvatar: '⚖️',
    triggerCondition: 'Riesgo de allanamiento o crecimiento de patrimonio',
    dialogue: 'Ministro, cómo le va... le habla el Juzgado Federal N° 12. Tengo acá en mi mesa una denuncia anónima de 400 fojas con fotos de unas valijas que entraron a su oficina el jueves a la noche. Me gustaría saber si tomamos un café en el Jockey Club para... emprolijar el expediente y evitar que se filtre a la prensa.',
    opciones: [
      {
        texto: '«Doctor, por supuesto. El mozo del Jockey ya tiene reservada nuestra mesa con dos botellas de vino de guarda.»',
        deltas: { guita: -4, instituciones: -6, caos: -3 },
        patrimonioDelta: -10000,
        consecuencia: 'El juez firma la nulidad de la causa por "falta de mérito probatorio". La causa queda archivada en un sótano con humedad.',
        cita: 'Fallo judicial: "No surgen elementos de sospecha en las actuaciones del digno funcionario ministerial."'
      },
      {
        texto: '«Doctor, yo no negocio con Comodoro Py. Venga a allanarme cuando quiera que tengo las manos limpias.»',
        deltas: { pueblo: 6, caos: 6, instituciones: 8 },
        patrimonioDelta: 0,
        consecuencia: 'Llegan 12 camionetas de la Policía de Seguridad Aeroportuaria a revisar hasta los paquetes de yerba del despacho.',
        cita: 'Móvil de TV en la puerta: "ESCÁNDALO EN EL MINISTERIO: PERROS BUSCADORES DE BILLETES EN LOS PASILLOS."'
      }
    ]
  }
];

export const SOUVENIRS: Souvenir[] = [
  {
    id: 'pinguino_vino',
    name: 'Pingüino de Vino Tinto de Bodegón',
    icon: '🐧',
    description: 'De cerámica esmaltada blanca con pico servilletero. Capacidad 1 litro de Malbec de la casa.',
    unlockedAt: '',
    howToUnlock: 'Completar 10 decisiones manteniendo el humor del Pueblo alto.'
  },
  {
    id: 'mate_alpaca',
    name: 'Mate Imperial con Virola de Alpaca',
    icon: '🧉',
    description: 'Calabaza brasilera forrada en cuero vacuno con cincelado artesanal criollo.',
    unlockedAt: '',
    howToUnlock: 'Cebar más de 10 mates durante la gestión.'
  },
  {
    id: 'cartas_truco_oro',
    name: 'Baraja Española Naipes Fournier 1978',
    icon: '🃏',
    description: 'Con el 1 de Espadas marcado con la uña y olor a tabaco de pipa. Ganado en una mano a muerte contra tu superior.',
    unlockedAt: '',
    howToUnlock: 'Ganarle una partida de Truco al Subsecretario Garramuño.'
  },
  {
    id: 'facsimil_decreto',
    name: 'Firma Dorada de DNU Presidencial',
    icon: '📜',
    description: 'Enmarcado en roble oscuro con tinta china indeleble. Otorga +50 de impunidad administrativa.',
    unlockedAt: '',
    howToUnlock: 'Ganar una mano de Truco cantando Vale Cuatro.'
  },
  {
    id: 'banderin_club',
    name: 'Banderín del Club Social y Deportivo',
    icon: '🚩',
    description: 'Con los flecos dorados deshilachados y firmas de los campeones del torneo barrial de 1986.',
    unlockedAt: '',
    howToUnlock: 'Resolver exitosamente un expediente relacionado a clubes de barrio o murgas.'
  },
  {
    id: 'valija_dolares',
    name: 'Valija Samsonite con Candado Numérico',
    icon: '💼',
    description: 'Tiene olor a cuero importado y billetes de 100 dólares con la banda azul termosellados.',
    unlockedAt: '',
    howToUnlock: 'Aceptar tu primer sobre marrón de coima ministerial.'
  },
  {
    id: 'pelota_pulpo',
    name: 'Pelota de Goma Pulpo N° 4',
    icon: '🔴',
    description: 'Rayada y saltarina. Clásica de los recreos de escuela pública y picaditos en la plaza.',
    unlockedAt: '',
    howToUnlock: 'Cantar Envido con 33 de tanto en el Truco contra tu superior.'
  },
  {
    id: 'taza_sindicato',
    name: 'Taza Enlozada del Gremio con Matecocido',
    icon: '☕',
    description: 'Manchada con café torrado fuerte. Resistió 14 huelgas generales y 6 cambios de gobierno.',
    unlockedAt: '',
    howToUnlock: 'Atender la llamada del Secretario General de la CGT y llegar a un acuerdo.'
  },
  {
    id: 'termo_stanley_trucho',
    name: 'Termo de Acero "Industria Nacional"',
    icon: '🫗',
    description: 'Pintado con epoxi verde oliva. Mantiene el agua hirviendo durante 36 horas de sesión en el Congreso.',
    unlockedAt: '',
    howToUnlock: 'Cebar más de 15 mates en tu gestión.'
  },
  {
    id: 'estampita_gauchito',
    name: 'Estampita Plastificada del Gauchito Gil',
    icon: '🎗️',
    description: 'Con cinta roja bendecida en Mercedes, Corrientes. Protege contra allanamientos y caídas de gabinete.',
    unlockedAt: '',
    howToUnlock: 'Sobrevivir a un pico de Caos de más de 85 puntos sin ser destituido.'
  },
  {
    id: 'copa_campeones',
    name: 'Réplica Miniatura de la Copa del Mundo',
    icon: '🏆',
    description: 'Brilla con purpurina dorada. Al mirarla suena "Muchachos" en el eco de los pasillos.',
    unlockedAt: '',
    howToUnlock: 'Alcanzar 20 expedientes firmados con éxito.'
  },
  {
    id: 'placa_bronce',
    name: 'Medalla al Prócer de la Burocracia',
    icon: '🥇',
    description: 'Otorgada por el Colegio de Escribanos y la Federación de Mesas de Entradas.',
    unlockedAt: '',
    howToUnlock: 'Alcanzar el final de Reelección Heroica o Jubilación en Villa Gesell.'
  }
];
