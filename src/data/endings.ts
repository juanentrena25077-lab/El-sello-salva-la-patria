import { Ending, Stats, StatInfo, StatKey } from '../types';

export const STAT_CONFIG: Record<StatKey, StatInfo> = {
  pueblo: {
    name: 'Pueblo',
    shortName: 'Humor Popular',
    icon: 'Users',
    description: 'El humor social de la gente en la calle, los aplausos o los cacerolazos.',
    dangerLow: '¡Cacerolazo inminente en la puerta del ministerio!',
    dangerHigh: '¡Culto mesiánico y reclamos desmedidos!',
    color: '#3C6E47'
  },
  caos: {
    name: 'Caos',
    shortName: 'Quilombo Callejero',
    icon: 'Flame',
    description: 'El nivel de piquetes, cortes de ruta, bombas de humo y descontrol urbano.',
    dangerLow: 'Demasiado silencio... el país se aburre.',
    dangerHigh: '¡La calle está que arde! Peligro de desmadre total.',
    color: '#A5333A'
  },
  guita: {
    name: 'Arcas',
    shortName: 'Reservas & Dólares',
    icon: 'Landmark',
    description: 'Los fondos del Banco Central, la recaudación y la capacidad de pago.',
    dangerLow: '¡Default inminente! No hay un mango partido al medio.',
    dangerHigh: 'Demasiada plata junta... sospechas de curro y allanamientos.',
    color: '#B9902E'
  },
  instituciones: {
    name: 'Instituciones',
    shortName: 'Rosca & Burocracia',
    icon: 'Scale',
    description: 'El respeto por las leyes, la justicia, los gremios y los procedimientos.',
    dangerLow: 'Anarquía administrativa: nadie respeta las normas.',
    dangerHigh: 'Parálisis burocrática: para respirar necesitás tres sellos.',
    color: '#24303A'
  }
};

export const TICKER_NEWS: string[] = [
  'URGENTE: Subió el dólar blue pero bajó el queso cremoso en La Matanza.',
  'Misterio en Constitución: un tren del Roca llegó a horario y la gente no sabe si subir.',
  'Clima en el conurbano: humedad 98%, ganas de laburar 0%.',
  'Frase del día en Mesa de Entradas: "Venga después de las 14:00 que se cayó el sistema".',
  'Polémica: descubren que la pava eléctrica del 3º piso calienta a 95º y quema la yerba.',
  'La bandera del balcón necesita una planchada urgente desde el Bicentenario.',
  'Alguien dejó un cartel en el baño de RRHH: "El que terminó el rollo de papel no tiene perdón".',
  'Se rumorea que el ministro desayuna empanadas frías de anoche con mate amargo.',
  'Paro preventivo de trapitos: exigen franelas de microfibra importada.',
  'La Scaloneta sigue invicta en el corazón de los 47 millones de argentinos.',
  'Un perro callejero fue nombrado Director General de Siestas en la ANSES de Lanús.',
  'AFIP investiga a un tipo que compró dos kilos de asado sin pedir cuotas.',
  'En Córdoba aseguran que el fernet cura el dolor de muela y la tristeza.',
  'Comenzó la temporada de "pará que está hirviendo el agua, esperá que enfríe".'
];

export const ENDINGS: Record<string, Ending> = {
  pueblo_low: {
    id: 'pueblo_low',
    title: 'CAÍDO A CACEROLAZOS',
    stamp: 'EXPULSADO POR EL PUEBLO',
    badge: 'Cacerolazo Masivo',
    subtitle: 'El humor social tocó fondo',
    description: 'Una noche te asomás al balcón de tu despacho y no hay estrellas: hay 200.000 personas con sartenes Essen y cucharas de alpaca haciendo un ruido atronador. Tuviste que salir disfrazado de empleado de correo en una furgoneta Kangoo blanca.',
    quote: 'Vecina con cacerola en mano: "¡Que se vaya a laburar de verdad, caradura!"',
    condition: (stats) => stats.pueblo <= 0
  },
  pueblo_high: {
    id: 'pueblo_high',
    title: 'CULTO MESIÁNICO DE LA PATRIA',
    stamp: 'CANONIZADO EN VIDA',
    badge: 'Idolatría Desmedida',
    subtitle: 'El pueblo te ama tanto que asusta',
    description: 'La devoción popular superó todos los límites republicanos. Hay estampitas con tu cara al lado del Gauchito Gil, 400 recién nacidos fueron bautizados con tu nombre y te declararon Emperador Vitalicio del Mate y la Alegría.',
    quote: 'Fanático con remera de tu cara: "¡Danos otro feriado y no laburamos nunca más, maestro!"',
    condition: (stats) => stats.pueblo >= 100
  },
  caos_high: {
    id: 'caos_high',
    title: 'EL GRAN QUILOMBO NACIONAL',
    stamp: 'EXPEDIENTE EN LLAMAS',
    badge: 'Anarquía Total',
    subtitle: 'El país se desmadró por completo',
    description: 'Hay piquetes adentro de los ascensores del ministerio, carreras clandestinas de carritos de supermercado en la 9 de Julio y un asado prendido sobre el capó del auto oficial. Nadie sabe quién manda, pero todos están comiendo chinchulines.',
    quote: 'Manifestante con bombo: "¡No sabemos qué pedimos pero no nos vamos nada!"',
    condition: (stats) => stats.caos >= 100
  },
  caos_low: {
    id: 'caos_low',
    title: 'SUIZA DEL SUBDESARROLLO',
    stamp: 'EXCESO DE TRANQUILIDAD',
    badge: 'Aburrimiento Mortal',
    subtitle: 'Todo está tan ordenado que da miedo',
    description: 'Lograste erradicar el quilombo, pero a un costo terrible: las calles parecen un cementerio suizo, nadie toca bocina, no hay discusiones de fútbol y los cafés están en silencio total. La población entra en depresión clínica por falta de adrenalina.',
    quote: 'Taxista bostezando: "Extraño cuando me cortaban el puente Pueyrredón, esto no es vida".',
    condition: (stats) => stats.caos <= 0
  },
  guita_low: {
    id: 'guita_low',
    title: 'DEFAULT Y CLUB DEL TRUEQUE',
    stamp: 'ARCA SIN FONDOS',
    badge: 'Bancarrota Histórica',
    subtitle: 'No quedó ni una moneda de diez centavos',
    description: 'Las reservas del Banco Central marcan cero absoluto. En el ministerio se paga el sueldo con paquetes de fideos secos y vales por dos docenas de tortas fritas. El FMI manda un emisario que se pone a llorar en la mesa de reuniones.',
    quote: 'Cajero del banco mirando la bóveda: "Acá no quedó ni la pelusa de los bolsillos".',
    condition: (stats) => stats.guita <= 0
  },
  guita_high: {
    id: 'guita_high',
    title: 'ALLANAMIENTO DE LA FEDERAL',
    stamp: 'INCAUTADO POR SOSPECHA',
    badge: 'Exceso de Cajas Fuertes',
    subtitle: 'Tanta plata junta despertó sospechas',
    description: 'Entró tanta guita de licitaciones raras y cobros extraordinarios que a las 5:45 AM te golpean la puerta del despacho tres jueces federales y una jauría de perros rastreadores de dólares termosellados.',
    quote: 'Oficial de justicia con carpeta: "Explíqueme qué hacen estos bolsos con dólares atrás de la fotocopiadora".',
    condition: (stats) => stats.guita >= 100
  },
  instituciones_low: {
    id: 'instituciones_low',
    title: 'GOLPE POR MEMO INTERNO',
    stamp: 'DESTITUIDO POR DECRETO',
    badge: 'Colapso Burocrático',
    subtitle: 'Nadie respeta tu autoridad',
    description: 'Las instituciones se desintegraron tanto que no hizo falta ni un tanque: el empleado de maestranza te dejó una nota en la puerta que decía "Queda usted cesante, favor de devolver la engrapadora". Y asumió una junta de streamers.',
    quote: 'Secretario general: "Jefe, le cambiamos la cerradura del despacho, pase a buscar sus cositas".',
    condition: (stats) => stats.instituciones <= 0
  },
  instituciones_high: {
    id: 'instituciones_high',
    title: 'EL LABERINTO DEL EXPEDIENTE ETERNO',
    stamp: 'TRÁMITE EN BUCLE INFINITO',
    badge: 'Parálisis Administrativa',
    subtitle: 'Demasiada burocracia para este mundo',
    description: 'Creaste un sistema tan perfecto de firmas cruzadas, sellos de agua y dictámenes previos que ahora necesitás tres decretos y un peritaje caligráfico para que te habiliten una taza de café en el bar de la esquina. Nada se mueve, pero todo está sellado.',
    quote: 'Abogado del Estado: "El trámite está impecable, calculemos que sale para el año 2064".',
    condition: (stats) => stats.instituciones >= 100
  },
  resign: {
    id: 'resign',
    title: 'JUBILACIÓN EN VILLA GESELL',
    stamp: 'EXPEDIENTE CERRADO POR EL FIRMANTE',
    badge: 'Retiro Digno',
    subtitle: 'Sobreviviste a la picadora de carne',
    description: 'Después de lidiar con decenas de expedientes insólitos y mantener al país tambaleando pero entero, dejás la lapicera sobre el escritorio, agarrás el termo Lumilagro y te vas a la costa a mirar el mar y comer churros con dulce de leche.',
    quote: 'Tu nota de despedida: "Firmen ustedes, yo cumplí con la Patria".',
    condition: (stats, count) => count >= 35 && Object.keys(stats).every(k => stats[k as StatKey] >= 25 && stats[k as StatKey] <= 75)
  },
  balanced: {
    id: 'balanced',
    title: 'REELECCIÓN HEROICA (EL MAGO DE LA ROSCA)',
    stamp: 'REVALIDADO POR LA HISTORIA',
    badge: 'Prócer de la Burocracia',
    subtitle: 'Mantuviste el equilibrio imposible',
    description: 'Contra todos los pronósticos y las leyes de la física política, piloteaste la tormenta: no te prendieron fuego el despacho, no te fundiste y no te allanaron. El país sigue de pie, atado con alambre pero de fiesta. Te renuevan el mandato con honores.',
    quote: 'Editorial de los diarios: "Nadie sabe cómo lo hizo, pero este tipo es Gardel con guitarra eléctrica".',
    condition: (stats, count) => count >= 50 && Object.keys(stats).every(k => stats[k as StatKey] >= 20 && stats[k as StatKey] <= 80)
  },
  familia_desalojo: {
    id: 'familia_desalojo',
    title: 'DESALOJO Y PLAZA DE MAYO',
    stamp: 'SIN TECHO POR MORA',
    badge: 'Desalojo Inminente',
    subtitle: 'La guita no llegó a casa para pagar el alquiler',
    description: 'No pudiste pagar el alquiler del PH durante días seguidos. El dueño vino acompañado por un patrullero y sacaron tu colchón de resortes vencidos, la mesa de fórmica y la pava a la vereda. Hoy dormís con Gladys y Braian en un banco de plaza bajo un plástico negro.',
    quote: 'Dueño del PH con la orden de desalojo: "La burocracia no me paga las expensas, maestro".',
    condition: () => false // Triggered dynamically by family state
  },
  familia_tragedia: {
    id: 'familia_tragedia',
    title: 'LUTO EN EL CONURBANO',
    stamp: 'TRAGEDIA POR DESAMPARO',
    badge: 'Duelo Familiar',
    subtitle: 'La falta de medicinas y calefacción fue fatal',
    description: 'Entre las heladas sin gas y las recetas retenidas en la farmacia, la salud de tu familia colapsó. La Nona no resistió la neumonía y el hogar quedó sumido en un silencio desgarrador que ningún expediente ni decreto puede reparar.',
    quote: 'Médico de la salita barrial: "Hicimos lo que pudimos, pero sin los medicamentos de base era imposible".',
    condition: () => false // Triggered dynamically by family state
  },
  familia_abandono: {
    id: 'familia_abandono',
    title: 'CARTA DE DESPEDIDA EN LA HELADERA',
    stamp: 'ABANDONO CONYUGAL',
    badge: 'Hogar Roto',
    subtitle: 'El hambre y la miseria quebraron a la familia',
    description: 'Llegás a las 21:30 con olor a tinta y las manos manchadas de sellos. La casa está a oscuras y vacía. En la puerta de la heladera hay un imán del delivery sujetando una carta: "Me fui con el nene a lo de mis viejos a Pergamino. No se puede vivir de mate cocido y patriotismo".',
    quote: 'Nota escrita con birome azul gastada: "Que te cocine el Presidente".',
    condition: () => false // Triggered dynamically by family state
  },
  familia_prospera: {
    id: 'familia_prospera',
    title: 'DINASTÍA BURÓCRATA EN RECOLETA',
    stamp: 'CASTA PURA Y TRIUNFANTE',
    badge: 'Éxito Familiar Supremo',
    subtitle: 'Lograste la salvación económica de todo tu clan',
    description: 'Entre viáticos de gestión y sobres estratégicos bajo la mesa, mudaste a la familia a un semipiso en Recoleta, Braian va a un colegio bilingüe y la Nona pasa sus tardes en un crucero de jubilados por el Caribe. Sos el orgullo indiscutido del árbol genealógico.',
    quote: 'Gladys brindando con copa de champagne: "Al final valió la pena quedarse horas extras en Mesa de Entradas, mi amor".',
    condition: () => false // Triggered dynamically by family state
  }
};
