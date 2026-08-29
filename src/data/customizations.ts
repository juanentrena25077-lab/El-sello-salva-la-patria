import { CustomizationItem, EquippedCustomizations } from '../types';

export const DEFAULT_EQUIPPED: EquippedCustomizations = {
  desk_theme: 'theme_nogal_republicano',
  stamp_ink: 'ink_dual_bicolor',
  screen_fx: 'fx_vision_limpia',
  desk_emblem: 'emblem_sol_republicano',
  folder_color: 'folder_manila_clasica'
};

export const CUSTOMIZATION_ITEMS: CustomizationItem[] = [
  // ==========================================
  // 1. TEMAS DEL ESCRITORIO Y DESPACHO
  // ==========================================
  {
    id: 'theme_nogal_republicano',
    name: 'Nogal Republicano Clásico',
    category: 'desk_theme',
    cost: 0,
    description: 'Madera de nogal lustrada con herrajes de bronce. La estética tradicional de la Casa Rosada.',
    previewColor: '#181a1b',
    previewIcon: '🪵',
    tag: 'Estándar Oficial'
  },
  {
    id: 'theme_caoba_presidencial',
    name: 'Caoba Presidencial 1880',
    category: 'desk_theme',
    cost: 220,
    description: 'Caoba rojiza pulida con molduras doradas y paño de cuero repujado estilo Palacio San Martín.',
    previewColor: '#2b1414',
    previewIcon: '🏛️',
    tag: 'Salón Dorado'
  },
  {
    id: 'theme_formica_1974',
    name: 'Fórmica Planta Permanente 1974',
    category: 'desk_theme',
    cost: 260,
    description: 'Superficie verde oliva y ceniceros de baquelita. El verdadero aroma a expediente añejo.',
    previewColor: '#1a241b',
    previewIcon: '📂',
    tag: 'Vintage Estatal'
  },
  {
    id: 'theme_medianoche_cyber',
    name: 'Vigilia de Medianoche (Prensa & Luces)',
    category: 'desk_theme',
    cost: 380,
    description: 'Azul noche profundo con resplandores de alumbrado público y cables de télex en vivo.',
    previewColor: '#101c29',
    previewIcon: '🌃',
    tag: 'Guardia Nocturna'
  },
  {
    id: 'theme_prensa_grafica',
    name: 'Prensa Gráfica & Tinta de Plomo',
    category: 'desk_theme',
    cost: 320,
    description: 'Estética monocromática de diario impreso en linotipia. Alto contraste sobrio y elegante.',
    previewColor: '#1f1f1f',
    previewIcon: '📰',
    tag: 'Edición Extra'
  },
  {
    id: 'theme_marmol_palaciego',
    name: 'Mármol de Carrara Palaciego',
    category: 'desk_theme',
    cost: 500,
    description: 'Mármol blanco frío con vetas grises y detalles en azul cobalto. La máxima distinción institucional.',
    previewColor: '#242a30',
    previewIcon: '🏛️',
    tag: 'Alta Jerarquía'
  },

  // ==========================================
  // 2. TINTAS Y ESTILOS DEL SELLO MINISTERIAL
  // ==========================================
  {
    id: 'ink_dual_bicolor',
    name: 'Bicolor Burocrático (Verde / Rojo)',
    category: 'stamp_ink',
    cost: 0,
    description: 'Verde esmeralda oficial para Autorizado y Rojo carmesí de rechazo tajante.',
    previewColor: '#22c55e',
    previewIcon: '🟢🔴',
    tag: 'Por Defecto'
  },
  {
    id: 'ink_neon_resaltador',
    name: 'Flúor Notarial (Verde Lima / Rojo Fuego)',
    category: 'stamp_ink',
    cost: 140,
    description: 'Tonos ultrabrillantes de máxima advertencia visual y contraste.',
    previewColor: '#84cc16',
    previewIcon: '⚡',
    tag: 'Alto Impacto'
  },
  {
    id: 'ink_violeta_oficial',
    name: 'Tinta Violeta Copiativa Clásica',
    category: 'stamp_ink',
    cost: 100,
    description: 'La nostálgica tinta violeta húmeda indeleble de mesa de entradas y juzgado de paz.',
    previewColor: '#8b5cf6',
    previewIcon: '🟣',
    tag: 'Nostalgia Estatal'
  },
  {
    id: 'ink_lacre_carmesi',
    name: 'Rojo Lacre Federal de Emergencia',
    category: 'stamp_ink',
    cost: 180,
    description: 'Tinta carmesí con relieve brillante y textura de cera sellada al fuego de los ministerios.',
    previewColor: '#ef4444',
    previewIcon: '🔴',
    tag: 'Urgente'
  },
  {
    id: 'ink_verde_dolar',
    name: 'Verde Billete Termosellado',
    category: 'stamp_ink',
    cost: 220,
    description: 'Verde esmeralda de papel moneda con micropuntos de seguridad y timbre fiscal.',
    previewColor: '#10b981',
    previewIcon: '💵',
    tag: 'Tesoro Nacional'
  },
  {
    id: 'ink_dorado_imperial',
    name: 'Dorado Prócer con Laureles',
    category: 'stamp_ink',
    cost: 350,
    description: 'Tinta dorada metalizada con partículas brillantes para decretos de necesidad y urgencia.',
    previewColor: '#E5B83B',
    previewIcon: '🟡',
    tag: 'Decreto Supremo'
  },
  {
    id: 'ink_azul_patrio',
    name: 'Azul Celeste de la Bandera',
    category: 'stamp_ink',
    cost: 240,
    description: 'Sello biceleste patriótico con el Sol de Mayo enmarcado en doble filete.',
    previewColor: '#0ea5e9',
    previewIcon: '🔵',
    tag: 'Bicentenario'
  },
  {
    id: 'ink_negro_sumario',
    name: 'Negro Carbón de Sumario Penal',
    category: 'stamp_ink',
    cost: 200,
    description: 'Tinta negra densa de cinta de máquina de escribir Remington con filo rústico.',
    previewColor: '#1A1A1A',
    previewIcon: '⚫',
    tag: 'Comodoro Py'
  },

  // ==========================================
  // 3. FILTROS VISUALES DE PANTALLA (HUD FX)
  // ==========================================
  {
    id: 'fx_vision_limpia',
    name: 'Visión Nítida de Despacho',
    category: 'screen_fx',
    cost: 0,
    description: 'Sin filtros de distorsión visual. Pantalla limpia y colores fieles.',
    previewColor: '#2B3B4C',
    previewIcon: '✨',
    tag: 'Modo Puro'
  },
  {
    id: 'fx_crt_scanlines',
    name: 'Tubo CRT con Scanlines de TV Antigua',
    category: 'screen_fx',
    cost: 220,
    description: 'Líneas de barrido horizontales y leve viñeteado de televisor a tubo de los 80.',
    previewColor: '#1A3322',
    previewIcon: '📺',
    tag: 'Efecto Crónica'
  },
  {
    id: 'fx_sepia_archivo',
    name: 'Filtro Sepia Documento Clasificado',
    category: 'screen_fx',
    cost: 190,
    description: 'Tono ámbar añejo que transporta la partida a una película documental de los años 50.',
    previewColor: '#4A3B24',
    previewIcon: '📜',
    tag: 'Archivo Histórico'
  },
  {
    id: 'fx_sodio_nocturno',
    name: 'Lámpara de Sodio / Lluvia Nocturna',
    category: 'screen_fx',
    cost: 240,
    description: 'Cálido resplandor ámbar de alumbrado público que se filtra por la ventana del ministerio.',
    previewColor: '#5C3814',
    previewIcon: '💡',
    tag: 'Noche de Vigilia'
  },
  {
    id: 'fx_fotocopia_minolta',
    name: 'Grano de Fotocopiadora Burocrática',
    category: 'screen_fx',
    cost: 160,
    description: 'Leve textura granulada de papel de copia xerográfica con bordes envejecidos.',
    previewColor: '#363636',
    previewIcon: '🖨️',
    tag: 'Papel Carbónico'
  },

  // ==========================================
  // 4. EMBLEMAS Y ESCUDOS DEL DESPACHO
  // ==========================================
  {
    id: 'emblem_sol_republicano',
    name: 'Sol de Mayo Republicano Clásico',
    category: 'desk_emblem',
    cost: 0,
    description: 'El emblema giratorio tradicional con 16 rayos rectos y flamígeros.',
    previewColor: '#B9902E',
    previewIcon: '☀️',
    tag: 'Oficial'
  },
  {
    id: 'emblem_sol_sonriente_1818',
    name: 'Sol Sonriente de la Primera Moneda',
    category: 'desk_emblem',
    cost: 120,
    description: 'El histórico rostro solar con mirada serena grabado en la primera moneda patria.',
    previewColor: '#FFD700',
    previewIcon: '🌞',
    tag: 'Histórico'
  },
  {
    id: 'emblem_carpincho_escribano',
    name: 'Carpincho con Sombrero de Escribano',
    category: 'desk_emblem',
    cost: 300,
    description: 'Mascota honoraria de la Mesa de Entradas. Aporta +100 de tranquilidad ante el caos.',
    previewColor: '#A06E3B',
    previewIcon: '🦫',
    tag: 'Patrimonio de la Fauna'
  },
  {
    id: 'emblem_mate_laureles',
    name: 'Mate Imperial con Virola de Oro',
    category: 'desk_emblem',
    cost: 260,
    description: 'Mate coronado por dos ramas de laurel cruzadas y moño celeste.',
    previewColor: '#3C6E47',
    previewIcon: '🧉',
    tag: 'Cultura Nacional'
  },
  {
    id: 'emblem_escarapela_flameante',
    name: 'Escarapela de Cintas con Moño',
    category: 'desk_emblem',
    cost: 200,
    description: 'Escarapela tejida a mano con cinta de seda celeste y blanca.',
    previewColor: '#6CACE4',
    previewIcon: '🏵️',
    tag: 'Tradición'
  },

  // ==========================================
  // 5. COLOR Y TEXTURA DE LA CARPETA
  // ==========================================
  {
    id: 'folder_manila_clasica',
    name: 'Cartulina Manila Tradicional',
    category: 'folder_color',
    cost: 0,
    description: 'La inconfundible cartulina beige manila con solapas dobladas y folio cosido.',
    previewColor: '#F7F2E5',
    previewIcon: '📁',
    tag: 'Por Defecto'
  },
  {
    id: 'folder_cuero_azul',
    name: 'Cuero Azul Cancillería',
    category: 'folder_color',
    cost: 210,
    description: 'Encuadernación de cuero azul medianoche con letras doradas y cintas de seda.',
    previewColor: '#1e293b',
    previewIcon: '📘',
    tag: 'Diplomático'
  },
  {
    id: 'folder_rojo_sumario',
    name: 'Sumario Penal Rojo Urgente',
    category: 'folder_color',
    cost: 240,
    description: 'Carpeta carmesí con faja diagonal de máxima reserva judicial.',
    previewColor: '#3f1719',
    previewIcon: '📕',
    tag: 'Causa Secreta'
  },
  {
    id: 'folder_verde_hacienda',
    name: 'Libro Contable Verde Hacienda',
    category: 'folder_color',
    cost: 190,
    description: 'Papel verde celadón con rayado contable y membrete de la Tesorería.',
    previewColor: '#1c2e24',
    previewIcon: '📗',
    tag: 'Presupuesto'
  },
  {
    id: 'folder_pergamino_antiguo',
    name: 'Pergamino Añejo con Borde Quemado',
    category: 'folder_color',
    cost: 280,
    description: 'Papel de trapo amarillento envejecido con tinta ferrogálica.',
    previewColor: '#e2d3b3',
    previewIcon: '📜',
    tag: 'Incunable'
  }
];

export const CATEGORY_NAMES: Record<
  CustomizationItem['category'],
  { label: string; icon: string; desc: string }
> = {
  desk_theme: {
    label: 'Escritorio & Despacho',
    icon: '🪵',
    desc: 'Cambia los acabados de madera, molduras y atmósfera del gabinete.'
  },
  stamp_ink: {
    label: 'Tinta del Sello',
    icon: '🔏',
    desc: 'Personaliza el color, textura y rebote de tu sello ministerial.'
  },
  screen_fx: {
    label: 'Filtro de Pantalla CRT',
    icon: '📺',
    desc: 'Aplica filtros de TV de tubo, scanlines, sepia o lámpara de sodio.'
  },
  desk_emblem: {
    label: 'Emblema Superior',
    icon: '☀️',
    desc: 'Elige el escudo que corona el encabezado oficial del ministerio.'
  },
  folder_color: {
    label: 'Carpeta de Expediente',
    icon: '📂',
    desc: 'Cambia el material y textura del legajo sobre tu escritorio.'
  }
};
