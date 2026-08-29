export type Suit = 'espadas' | 'bastos' | 'oros' | 'copas';

export interface TrucoCard {
  id: string;
  number: number;
  suit: Suit;
  rank: number; // 1 (4s) to 14 (1 de espadas)
  name: string;
  shortName: string;
  suitSymbol: string;
  suitColor: string;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  espadas: '⚔️',
  bastos: '🪵',
  oros: '🪙',
  copas: '🏆'
};

const SUIT_COLORS: Record<Suit, string> = {
  espadas: 'text-sky-300',
  bastos: 'text-emerald-400',
  oros: 'text-amber-300',
  copas: 'text-red-400'
};

// Calculate Truco ranking (14 is highest)
export function getCardRank(num: number, suit: Suit): number {
  if (num === 1 && suit === 'espadas') return 14; // Macho / Ancho de Espadas
  if (num === 1 && suit === 'bastos') return 13;  // Hembra / Ancho de Bastos
  if (num === 7 && suit === 'espadas') return 12; // Manilla de Espadas
  if (num === 7 && suit === 'oros') return 11;    // Manilla de Oros
  if (num === 3) return 10;
  if (num === 2) return 9;
  if (num === 1 && (suit === 'oros' || suit === 'copas')) return 8; // Anchos falsos
  if (num === 12) return 7; // Reyes
  if (num === 11) return 6; // Caballos
  if (num === 10) return 5; // Sotas
  if (num === 7 && (suit === 'bastos' || suit === 'copas')) return 4; // Sietes falsos
  if (num === 6) return 3;
  if (num === 5) return 2;
  if (num === 4) return 1;
  return 1;
}

export function createDeck(): TrucoCard[] {
  const suits: Suit[] = ['espadas', 'bastos', 'oros', 'copas'];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const deck: TrucoCard[] = [];

  for (const suit of suits) {
    for (const num of numbers) {
      const rank = getCardRank(num, suit);
      const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
      deck.push({
        id: `${num}_${suit}`,
        number: num,
        suit,
        rank,
        name: `${num} de ${suitName}`,
        shortName: `${num}${suit.charAt(0).toUpperCase()}`,
        suitSymbol: SUIT_SYMBOLS[suit],
        suitColor: SUIT_COLORS[suit]
      });
    }
  }

  // Shuffle deck using Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// Calculate Envido points for a hand of 3 cards
export function calculateEnvido(cards: TrucoCard[]): number {
  if (!cards || cards.length === 0) return 0;

  const cardEnvidoVal = (c: TrucoCard) => (c.number >= 10 ? 0 : c.number);

  let maxEnvido = 0;

  // Check pairs
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i].suit === cards[j].suit) {
        const val = 20 + cardEnvidoVal(cards[i]) + cardEnvidoVal(cards[j]);
        if (val > maxEnvido) maxEnvido = val;
      }
    }
  }

  // If no suit pair, max individual card
  if (maxEnvido === 0) {
    for (const c of cards) {
      const val = cardEnvidoVal(c);
      if (val > maxEnvido) maxEnvido = val;
    }
  }

  return maxEnvido;
}

export type BetState =
  | 'none'
  | 'truco_asked'
  | 'truco_accepted'
  | 'retruco_asked'
  | 'retruco_accepted'
  | 'vale_cuatro_asked'
  | 'vale_cuatro_accepted';

export type EnvidoState =
  | 'none'
  | 'envido_asked'
  | 'envido_accepted'
  | 'real_envido_asked'
  | 'real_envido_accepted'
  | 'falta_envido_asked'
  | 'falta_envido_accepted'
  | 'resolved';
