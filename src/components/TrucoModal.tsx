import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrucoCard,
  createDeck,
  calculateEnvido,
  BetState,
  EnvidoState
} from '../utils/truco';
import { sound } from '../utils/sound';
import { X, Award, RotateCcw, Volume2, Sparkles, MessageSquare } from 'lucide-react';

interface TrucoModalProps {
  onClose: () => void;
  onWinMatch: (withValeCuatro: boolean, had33Envido: boolean) => void;
}

interface PlayedCard {
  card: TrucoCard;
  by: 'player' | 'opponent';
}

export const TrucoModal: React.FC<TrucoModalProps> = ({
  onClose,
  onWinMatch
}) => {
  const TARGET_SCORE = 15;

  // Match Scores
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [isPlayerMano, setIsPlayerMano] = useState<boolean>(true);

  // Current Hand State
  const [playerHand, setPlayerHand] = useState<TrucoCard[]>([]);
  const [opponentHand, setOpponentHand] = useState<TrucoCard[]>([]);
  const [playerPlayedCards, setPlayerPlayedCards] = useState<TrucoCard[]>([]);
  const [opponentPlayedCards, setOpponentPlayedCards] = useState<TrucoCard[]>([]);

  // Trick status (3 rounds per hand)
  const [currentTrick, setCurrentTrick] = useState<number>(1);
  const [trickWinners, setTrickWinners] = useState<('player' | 'opponent' | 'tie')[]>([]);
  const [turn, setTurn] = useState<'player' | 'opponent'>('player');

  // Bet States
  const [trucoLevel, setTrucoLevel] = useState<number>(1); // 1 = regular (1pt), 2 = truco (2pt), 3 = retruco (3pt), 4 = vale cuatro (4pt)
  const [trucoState, setTrucoState] = useState<BetState>('none');
  const [trucoTurn, setTrucoTurn] = useState<'player' | 'opponent' | null>(null); // Who is being asked

  // Envido States
  const [envidoState, setEnvidoState] = useState<EnvidoState>('none');
  const [envidoBetPoints, setEnvidoBetPoints] = useState<number>(0);
  const [envidoCantado, setEnvidoCantado] = useState<boolean>(false);
  const [envidoAskingTurn, setEnvidoAskingTurn] = useState<'player' | 'opponent' | null>(null);

  // Dialog & Log
  const [dialogue, setDialogue] = useState<string>(
    '«Barajo y reparto. Una manito de truco para despejar la cabeza de expedientes, pibe.»'
  );
  const [actionNotice, setActionNotice] = useState<string>('Tu turno de jugar carta o cantar.');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

  // Track feats for trophies
  const [hadValeCuatroWin, setHadValeCuatroWin] = useState<boolean>(false);
  const [had33Envido, setHad33Envido] = useState<boolean>(false);

  // Initial Deal
  const dealNewHand = useCallback((nextPlayerMano: boolean) => {
    const deck = createDeck();
    const pHand = [deck[0], deck[1], deck[2]];
    const oHand = [deck[3], deck[4], deck[5]];

    setPlayerHand(pHand);
    setOpponentHand(oHand);
    setPlayerPlayedCards([]);
    setOpponentPlayedCards([]);
    setCurrentTrick(1);
    setTrickWinners([]);
    setTrucoLevel(1);
    setTrucoState('none');
    setTrucoTurn(null);
    setEnvidoState('none');
    setEnvidoBetPoints(0);
    setEnvidoCantado(false);
    setEnvidoAskingTurn(null);
    setIsPlayerMano(nextPlayerMano);
    setTurn(nextPlayerMano ? 'player' : 'opponent');

    const pEnv = calculateEnvido(pHand);
    if (pEnv === 33) setHad33Envido(true);

    sound.playCardSlap();
    setActionNotice(nextPlayerMano ? 'Sos MANO. Jugá o cantá Envido/Truco.' : 'Garramuño es MANO.');
    setDialogue('«A ver qué te tocó en el reparto... No te me achiques.»');
  }, []);

  // Initialize Game
  useEffect(() => {
    dealNewHand(true);
  }, [dealNewHand]);

  // Player Envido
  const playerEnvido = useMemo(() => calculateEnvido(playerHand.concat(playerPlayedCards)), [
    playerHand,
    playerPlayedCards
  ]);
  const opponentEnvido = useMemo(
    () => calculateEnvido(opponentHand.concat(opponentPlayedCards)),
    [opponentHand, opponentPlayedCards]
  );

  // Check Match Winner
  useEffect(() => {
    if (playerScore >= TARGET_SCORE) {
      setGameOver(true);
      setWinner('player');
      sound.playUnlock();
      onWinMatch(hadValeCuatroWin, had33Envido);
      setDialogue('«¡Qué lo parió, pibe! Me pelaste en el truco. Te ganaste la baraja del 78.»');
    } else if (opponentScore >= TARGET_SCORE) {
      setGameOver(true);
      setWinner('opponent');
      setDialogue('«Te falta sopa de mesa de entradas, pibe. ¡Pagate las medialunas!»');
    }
  }, [playerScore, opponentScore, hadValeCuatroWin, had33Envido, onWinMatch]);

  // Handle Score Addition
  const addScore = (target: 'player' | 'opponent', pts: number, reason: string) => {
    sound.playFosforito();
    if (target === 'player') {
      setPlayerScore((prev) => prev + pts);
      setActionNotice(`¡Ganaste ${pts} punto(s) por ${reason}!`);
    } else {
      setOpponentScore((prev) => prev + pts);
      setActionNotice(`Garramuño suma ${pts} punto(s) por ${reason}.`);
    }
  };

  // AI Logic Trigger for Opponent Turn
  useEffect(() => {
    if (gameOver) return;

    if (turn === 'opponent' && envidoAskingTurn === null && trucoTurn === null) {
      const timer = setTimeout(() => {
        aiPlayCardOrCant();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [turn, opponentHand, currentTrick, envidoCantado, trucoState, envidoAskingTurn, trucoTurn, gameOver]);

  // AI Opponent Decision on His Turn
  const aiPlayCardOrCant = () => {
    if (opponentHand.length === 0) return;

    // 1. Consider singing Envido on trick 1 if mano or asked
    if (currentTrick === 1 && !envidoCantado && envidoState === 'none') {
      if (opponentEnvido >= 28 || (Math.random() < 0.25 && opponentEnvido >= 25)) {
        sound.playTrucoShout();
        setEnvidoState('envido_asked');
        setEnvidoBetPoints(2);
        setEnvidoCantado(true);
        setEnvidoAskingTurn('player');
        setDialogue('«¡ENVIDO al bulto! ¿Qué me cantás?»');
        return;
      }
    }

    // 2. Consider singing Truco if AI has strong cards
    const maxRank = Math.max(...opponentHand.map((c) => c.rank));
    if (trucoState === 'none' && (maxRank >= 11 || (currentTrick >= 2 && Math.random() < 0.4))) {
      sound.playTrucoShout();
      setTrucoState('truco_asked');
      setTrucoLevel(2);
      setTrucoTurn('player');
      setDialogue('«¡¡TRUUUCO!! A ver de qué te disfrazás ahora, pibe.»');
      return;
    }

    // 3. Otherwise, play a card
    // AI chooses best or strategic card
    let cardToPlay: TrucoCard;
    if (playerPlayedCards.length > opponentPlayedCards.length) {
      // Player already played a card in this trick
      const playerCard = playerPlayedCards[playerPlayedCards.length - 1];
      // Find lowest winning card
      const winningCards = opponentHand
        .filter((c) => c.rank > playerCard.rank)
        .sort((a, b) => a.rank - b.rank);
      if (winningCards.length > 0) {
        cardToPlay = winningCards[0];
      } else {
        // Sacrifice lowest card
        cardToPlay = [...opponentHand].sort((a, b) => a.rank - b.rank)[0];
      }
    } else {
      // AI is leading this trick: play medium or high
      cardToPlay = opponentHand[Math.floor(Math.random() * opponentHand.length)];
    }

    playCardForOpponent(cardToPlay);
  };

  // Play Card Opponent
  const playCardForOpponent = (card: TrucoCard) => {
    sound.playCardSlap();
    setOpponentHand((prev) => prev.filter((c) => c.id !== card.id));
    setOpponentPlayedCards((prev) => [...prev, card]);

    // Check trick resolution
    if (playerPlayedCards.length === opponentPlayedCards.length + 1) {
      // Player already played this trick, resolve it
      const pCard = playerPlayedCards[playerPlayedCards.length - 1];
      resolveTrick(pCard, card);
    } else {
      // Player's turn to play
      setTurn('player');
      setActionNotice(`Garramuño jugó el ${card.name}. Tu turno.`);
    }
  };

  // Player Plays Card
  const handlePlayerCardClick = (card: TrucoCard) => {
    if (turn !== 'player' || envidoAskingTurn !== null || trucoTurn !== null) return;

    sound.playCardSlap();
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));
    setPlayerPlayedCards((prev) => [...prev, card]);

    if (opponentPlayedCards.length === playerPlayedCards.length + 1) {
      // Opponent already played this trick, resolve it
      const oCard = opponentPlayedCards[opponentPlayedCards.length - 1];
      resolveTrick(card, oCard);
    } else {
      // Opponent's turn to play
      setTurn('opponent');
      setActionNotice(`Jugaste el ${card.name}. Le toca a Garramuño.`);
    }
  };

  // Resolve 1 Trick
  const resolveTrick = (pCard: TrucoCard, oCard: TrucoCard) => {
    let trickWinner: 'player' | 'opponent' | 'tie' = 'tie';
    if (pCard.rank > oCard.rank) {
      trickWinner = 'player';
      setDialogue('«¡Buena carta metiste ahí, che!»');
    } else if (oCard.rank > pCard.rank) {
      trickWinner = 'opponent';
      setDialogue('«Esa carta te la mato de taquito.»');
    } else {
      trickWinner = 'tie';
      setDialogue('«¡Parda la mejor! Esto se define con los dientes apretados.»');
    }

    const nextWinners = [...trickWinners, trickWinner];
    setTrickWinners(nextWinners);

    // Evaluate Hand Outcome after this trick
    const pWins = nextWinners.filter((w) => w === 'player').length;
    const oWins = nextWinners.filter((w) => w === 'opponent').length;

    // Check if hand is won
    let handWinner: 'player' | 'opponent' | null = null;

    if (pWins === 2) {
      handWinner = 'player';
    } else if (oWins === 2) {
      handWinner = 'opponent';
    } else if (nextWinners.length === 2 && nextWinners[0] === 'tie' && nextWinners[1] !== 'tie') {
      // Tied 1st, whoever wins 2nd wins
      handWinner = nextWinners[1] === 'player' ? 'player' : 'opponent';
    } else if (nextWinners.length === 3) {
      if (nextWinners[0] !== 'tie' && nextWinners[1] === 'tie') {
        handWinner = nextWinners[0] === 'player' ? 'player' : 'opponent';
      } else if (nextWinners[0] === 'tie' && nextWinners[1] === 'tie' && nextWinners[2] === 'tie') {
        handWinner = isPlayerMano ? 'player' : 'opponent';
      } else if (pWins > oWins) {
        handWinner = 'player';
      } else if (oWins > pWins) {
        handWinner = 'opponent';
      } else {
        handWinner = isPlayerMano ? 'player' : 'opponent';
      }
    }

    if (handWinner) {
      const points = trucoLevel;
      if (points === 4 && handWinner === 'player') {
        setHadValeCuatroWin(true);
      }
      setTimeout(() => {
        addScore(handWinner, points, `mano de Truco (${points} pts)`);
        setDialogue(
          handWinner === 'player'
            ? '«¡Ganaste la mano! Ya barajo de nuevo.»'
            : '«Esta mano me la llevo yo al buche.»'
        );
        setTimeout(() => dealNewHand(!isPlayerMano), 1400);
      }, 700);
    } else {
      // Continue next trick
      setCurrentTrick((prev) => prev + 1);
      // Winner of this trick leads next trick (or mano if tied)
      if (trickWinner === 'player') {
        setTurn('player');
      } else if (trickWinner === 'opponent') {
        setTurn('opponent');
      } else {
        setTurn(isPlayerMano ? 'player' : 'opponent');
      }
    }
  };

  // ENVIDO ACTIONS (Player Cantos)
  const handlePlayerCantaEnvido = (type: 'envido' | 'real_envido' | 'falta_envido') => {
    sound.playTrucoShout();
    setEnvidoCantado(true);
    let pts = 2;
    if (type === 'real_envido') pts = 3;
    if (type === 'falta_envido') pts = TARGET_SCORE - Math.max(playerScore, opponentScore);

    setEnvidoBetPoints(pts);
    setEnvidoState(type === 'envido' ? 'envido_asked' : type === 'real_envido' ? 'real_envido_asked' : 'falta_envido_asked');
    setEnvidoAskingTurn('opponent');

    // AI evaluates response
    setTimeout(() => {
      aiRespondToEnvido(pts);
    }, 600);
  };

  const aiRespondToEnvido = (pts: number) => {
    if (opponentEnvido >= 27 || (pts <= 2 && opponentEnvido >= 24)) {
      // AI Wants
      setDialogue(`«¡QUIERO! Yo tengo ${opponentEnvido}. ¿Qué tenés vos?»`);
      setEnvidoAskingTurn(null);
      setEnvidoState('resolved');

      setTimeout(() => {
        if (playerEnvido > opponentEnvido) {
          addScore('player', pts, `Envido (${playerEnvido} a ${opponentEnvido})`);
          setDialogue(`«¡Son buenas! Con ${playerEnvido} me pasaste el trapo.»`);
        } else if (opponentEnvido > playerEnvido) {
          addScore('opponent', pts, `Envido (${opponentEnvido} a ${playerEnvido})`);
          setDialogue(`«¡Las mías son mejores! Sumé ${opponentEnvido} puntos.»`);
        } else {
          // Tie goes to Mano
          const tieWinner = isPlayerMano ? 'player' : 'opponent';
          addScore(tieWinner, pts, `Envido pardo (gana Mano con ${playerEnvido})`);
          setDialogue(`«Empardamos en ${playerEnvido}, pero la Mano manda.»`);
        }
      }, 700);
    } else {
      // AI Rejects
      setEnvidoAskingTurn(null);
      setEnvidoState('resolved');
      addScore('player', 1, 'No quiso el Envido');
      setDialogue('«No quiero, andá a cobrar el punto.»');
    }
  };

  // Player Responds to AI's Envido
  const handlePlayerRespondEnvido = (accept: boolean) => {
    setEnvidoAskingTurn(null);
    setEnvidoState('resolved');
    if (!accept) {
      addScore('opponent', 1, 'No quisiste el Envido');
      setDialogue('«¡Adentro ese puntito! Seguimos jugando.»');
    } else {
      const pts = envidoBetPoints || 2;
      if (playerEnvido > opponentEnvido) {
        addScore('player', pts, `Envido (${playerEnvido} a ${opponentEnvido})`);
        setDialogue(`«¡Pucha, me clavaste ${playerEnvido}! Son buenas.»`);
      } else if (opponentEnvido > playerEnvido) {
        addScore('opponent', pts, `Envido (${opponentEnvido} a ${playerEnvido})`);
        setDialogue(`«¡Con ${opponentEnvido} no me gana nadie acá!»`);
      } else {
        const tieWinner = isPlayerMano ? 'player' : 'opponent';
        addScore(tieWinner, pts, `Envido pardo (${playerEnvido})`);
        setDialogue(`«Parda de ${playerEnvido}, define la Mano.»`);
      }
    }
  };

  // TRUCO ACTIONS (Player Cantos)
  const handlePlayerCantaTruco = (level: number) => {
    sound.playTrucoShout();
    setTrucoLevel(level);
    setTrucoState(level === 2 ? 'truco_asked' : level === 3 ? 'retruco_asked' : 'vale_cuatro_asked');
    setTrucoTurn('opponent');

    setTimeout(() => {
      aiRespondToTruco(level);
    }, 700);
  };

  const aiRespondToTruco = (level: number) => {
    const maxRank = Math.max(...opponentHand.map((c) => c.rank), 0);

    // If Vale Cuatro
    if (level === 4) {
      if (maxRank >= 12 || Math.random() < 0.3) {
        setTrucoState('vale_cuatro_accepted');
        setTrucoTurn(null);
        setDialogue('«¡¡QUIERO VALE CUATRO AL PECHO!! ¡Mostrá lo que tenés!»');
      } else {
        setTrucoTurn(null);
        addScore('player', 3, 'No quiso el Vale Cuatro');
        setDialogue('«¡No quiero, me voy al mazo! Estás muy afilado hoy.»');
        setTimeout(() => dealNewHand(!isPlayerMano), 1200);
      }
      return;
    }

    // If Truco (level 2) or Retruco (level 3)
    if (maxRank >= 10 || Math.random() < 0.45) {
      // Accept or counter
      if (level === 2 && maxRank >= 13 && Math.random() < 0.5) {
        // AI Retruco
        setTrucoLevel(3);
        setTrucoState('retruco_asked');
        setTrucoTurn('player');
        setDialogue('«¡¡QUIERO RETRUCO Y TE TIEMBLA EL SELLO!!»');
      } else {
        setTrucoState(level === 2 ? 'truco_accepted' : 'retruco_accepted');
        setTrucoTurn(null);
        setDialogue(level === 2 ? '«¡QUIERO TRUCO! Tirala en la mesa.»' : '«¡QUIERO RETRUCO! No me asustás.»');
      }
    } else {
      // AI Folds
      setTrucoTurn(null);
      const pts = level - 1;
      addScore('player', pts, 'No quiso el Truco');
      setDialogue('«No quiero, andá a cobrar los puntos y barajá.»');
      setTimeout(() => dealNewHand(!isPlayerMano), 1200);
    }
  };

  // Player Responds to AI's Truco/Retruco
  const handlePlayerRespondTruco = (accept: boolean, raiseTo?: number) => {
    if (raiseTo) {
      handlePlayerCantaTruco(raiseTo);
      return;
    }

    setTrucoTurn(null);
    if (!accept) {
      const pts = trucoLevel - 1;
      addScore('opponent', pts, 'Te fuiste al mazo');
      setDialogue('«¡Al mazo! Sabia decisión ministerial.»');
      setTimeout(() => dealNewHand(!isPlayerMano), 1200);
    } else {
      setTrucoState(trucoLevel === 2 ? 'truco_accepted' : trucoLevel === 3 ? 'retruco_accepted' : 'vale_cuatro_accepted');
      setDialogue('«¡Se armó la partida! Sigamos.»');
    }
  };

  // Matchsticks render helper (5 points per square)
  const renderMatchsticks = (points: number) => {
    const fullBoxes = Math.floor(points / 5);
    const remainder = points % 5;

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {Array.from({ length: fullBoxes }).map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 border-2 border-amber-400 bg-amber-950/40 relative rounded-sm flex items-center justify-center font-bold text-[10px] text-amber-300 shadow-sm"
          >
            ✕
          </div>
        ))}
        {remainder > 0 && (
          <div className="w-6 h-6 border-2 border-amber-400/80 bg-amber-950/20 relative rounded-sm flex items-center justify-center font-bold text-xs text-amber-200">
            {remainder === 1 && '|'}
            {remainder === 2 && '⊔'}
            {remainder === 3 && '⊐'}
            {remainder === 4 && '□'}
          </div>
        )}
        <span className="font-mono text-sm font-bold text-amber-400 ml-1">
          {points}/{TARGET_SCORE}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div
        id="truco-argentino-modal"
        className="w-full max-w-2xl bg-[#0f2415] text-[#EDE6D3] border-4 border-[#B9902E] rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Top Baize Header */}
        <div className="bg-[#1b3d24] px-4 py-3 border-b-2 border-[#B9902E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🃏</span>
            <div>
              <h2 className="font-['Courier_Prime',monospace] font-bold text-sm sm:text-base text-[#FFEAA7]">
                TRUCO CRIOLLO MINISTERIAL (A 15 PUNTOS)
              </h2>
              <p className="text-[10px] font-mono text-emerald-300">
                Desafío mano a mano contra el Dr. Anselmo "El Zorro" Garramuño
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#142e1b] hover:bg-[#20472a] text-[#EDE6D3] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tanteador (Scoreboard with matchsticks) */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#0a180e] border-b border-[#B9902E]/40 text-xs">
          <div className="bg-[#142e1b] p-2.5 rounded-lg border border-emerald-700/60">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-1">
              <span className="font-bold">TU PUNTAJE (MINISTRO) {isPlayerMano && '· [MANO]'}</span>
              <span className="text-[10px] text-[#FFEAA7]">Tanto: {playerEnvido}</span>
            </div>
            {renderMatchsticks(playerScore)}
          </div>

          <div className="bg-[#1a2b1f] p-2.5 rounded-lg border border-emerald-700/60">
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 mb-1">
              <span className="font-bold">DR. GARRAMUÑO {!isPlayerMano && '· [MANO]'}</span>
              <span className="text-[10px] text-gray-400">Puntaje</span>
            </div>
            {renderMatchsticks(opponentScore)}
          </div>
        </div>

        {/* Felt Table Center (Opponent & Played Cards) */}
        <div className="p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#173e21] to-[#0d2213] flex-1 flex flex-col justify-between relative shadow-inner overflow-hidden min-h-[300px]">
          {/* Opponent Area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#20472a] border border-[#B9902E] flex items-center justify-center text-xl shadow-md">
                🕵️‍♂️
              </div>
              <div>
                <span className="font-serif font-bold text-xs text-white">Anselmo Garramuño</span>
                <div className="flex gap-1 mt-0.5">
                  {opponentHand.map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-7 bg-[#B9902E] border border-amber-200 rounded-sm shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Anselmo Speech Bubble */}
            <div className="max-w-[260px] bg-[#0c1c11] border-2 border-[#B9902E]/60 p-2.5 rounded-xl text-xs font-serif italic text-[#FFEAA7] shadow-lg animate-in fade-in">
              {dialogue}
            </div>
          </div>

          {/* Table Center: Played Cards of Current Trick */}
          <div className="my-auto py-3 flex flex-col items-center justify-center gap-3">
            <div className="text-[11px] font-mono text-emerald-300 bg-black/40 px-3 py-0.5 rounded-full border border-emerald-600/30">
              Mano {currentTrick}° de 3 · {actionNotice}
            </div>

            <div className="flex items-center gap-6">
              {/* Opponent's played card */}
              <div className="text-center">
                <div className="text-[10px] font-mono text-amber-300 mb-1">Carta de Anselmo</div>
                {opponentPlayedCards.length > 0 ? (
                  <div className="w-16 h-24 bg-[#FAF7EE] text-black border-2 border-black rounded-lg p-1.5 shadow-xl flex flex-col justify-between select-none rotate-2">
                    <div className="font-mono font-bold text-xs text-left">
                      {opponentPlayedCards[opponentPlayedCards.length - 1].number}
                    </div>
                    <div className="text-2xl text-center">
                      {opponentPlayedCards[opponentPlayedCards.length - 1].suitSymbol}
                    </div>
                    <div className="font-mono font-bold text-[10px] text-right truncate">
                      {opponentPlayedCards[opponentPlayedCards.length - 1].shortName}
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-24 border-2 border-dashed border-emerald-700/50 rounded-lg flex items-center justify-center text-xs text-emerald-600">
                    Mesa
                  </div>
                )}
              </div>

              {/* Player's played card */}
              <div className="text-center">
                <div className="text-[10px] font-mono text-emerald-300 mb-1">Tu Carta</div>
                {playerPlayedCards.length > 0 ? (
                  <div className="w-16 h-24 bg-[#FAF7EE] text-black border-2 border-black rounded-lg p-1.5 shadow-xl flex flex-col justify-between select-none -rotate-2">
                    <div className="font-mono font-bold text-xs text-left">
                      {playerPlayedCards[playerPlayedCards.length - 1].number}
                    </div>
                    <div className="text-2xl text-center">
                      {playerPlayedCards[playerPlayedCards.length - 1].suitSymbol}
                    </div>
                    <div className="font-mono font-bold text-[10px] text-right truncate">
                      {playerPlayedCards[playerPlayedCards.length - 1].shortName}
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-24 border-2 border-dashed border-emerald-700/50 rounded-lg flex items-center justify-center text-xs text-emerald-600">
                    Mesa
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player Hand & Action Controls */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 mb-1 px-1">
              <span>TUS CARTAS EN MANO (Hacé clic para jugar)</span>
              <span>Tanto acumulado: <strong className="text-[#FFEAA7]">{playerEnvido} pts</strong></span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-3">
              {playerHand.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handlePlayerCardClick(card)}
                  disabled={turn !== 'player' || envidoAskingTurn !== null || trucoTurn !== null || gameOver}
                  className={`w-20 h-28 bg-[#FAF7EE] text-black border-2 border-black rounded-lg p-2 shadow-2xl flex flex-col justify-between transition-all cursor-pointer select-none ${
                    turn === 'player' && envidoAskingTurn === null && trucoTurn === null
                      ? 'hover:-translate-y-3 hover:shadow-[0_10px_20px_rgba(255,234,167,0.4)] active:scale-95'
                      : 'opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-center font-mono font-black text-sm">
                    <span>{card.number}</span>
                    <span className="text-base">{card.suitSymbol}</span>
                  </div>
                  <div className="text-3xl text-center my-auto">{card.suitSymbol}</div>
                  <div className="font-mono text-[9px] font-bold text-gray-700 text-center truncate">
                    {card.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons Panel */}
            <div className="bg-[#0c1d11] p-2.5 rounded-lg border border-[#B9902E]/40 space-y-2">
              {/* If Anselmo asked Envido */}
              {envidoAskingTurn === 'player' && (
                <div className="flex items-center justify-center gap-2 animate-bounce">
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    Garramuño cantó Envido:
                  </span>
                  <button
                    onClick={() => handlePlayerRespondEnvido(true)}
                    className="px-3 py-1.5 rounded bg-[#3C6E47] hover:bg-[#2F5837] text-white font-mono text-xs font-bold shadow cursor-pointer"
                  >
                    ¡QUIERO! ({playerEnvido} pts)
                  </button>
                  <button
                    onClick={() => handlePlayerRespondEnvido(false)}
                    className="px-3 py-1.5 rounded bg-[#A5333A] hover:bg-[#8B2329] text-white font-mono text-xs font-bold shadow cursor-pointer"
                  >
                    NO QUIERO
                  </button>
                </div>
              )}

              {/* If Anselmo asked Truco */}
              {trucoTurn === 'player' && (
                <div className="flex items-center justify-center gap-2 animate-bounce">
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    Garramuño cantó {trucoLevel === 2 ? 'TRUCO' : 'RETRUCO'}:
                  </span>
                  <button
                    onClick={() => handlePlayerRespondTruco(true)}
                    className="px-3 py-1.5 rounded bg-[#3C6E47] hover:bg-[#2F5837] text-white font-mono text-xs font-bold shadow cursor-pointer"
                  >
                    ¡QUIERO!
                  </button>
                  {trucoLevel === 2 && (
                    <button
                      onClick={() => handlePlayerRespondTruco(true, 3)}
                      className="px-3 py-1.5 rounded bg-[#B9902E] hover:bg-[#A37D24] text-black font-mono text-xs font-bold shadow cursor-pointer"
                    >
                      ¡QUIERO RETRUCO!
                    </button>
                  )}
                  {trucoLevel === 3 && (
                    <button
                      onClick={() => handlePlayerRespondTruco(true, 4)}
                      className="px-3 py-1.5 rounded bg-[#B9902E] hover:bg-[#A37D24] text-black font-mono text-xs font-bold shadow cursor-pointer"
                    >
                      ¡¡VALE CUATRO!!
                    </button>
                  )}
                  <button
                    onClick={() => handlePlayerRespondTruco(false)}
                    className="px-3 py-1.5 rounded bg-[#A5333A] hover:bg-[#8B2329] text-white font-mono text-xs font-bold shadow cursor-pointer"
                  >
                    NO QUIERO (AL MAZO)
                  </button>
                </div>
              )}

              {/* Normal Player Cantos */}
              {envidoAskingTurn === null && trucoTurn === null && !gameOver && (
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                  {/* Envido options on trick 1 */}
                  {currentTrick === 1 && !envidoCantado && (
                    <>
                      <button
                        onClick={() => handlePlayerCantaEnvido('envido')}
                        className="px-2.5 py-1.5 rounded bg-[#1e4428] hover:bg-[#2a5d37] text-emerald-200 font-mono font-bold border border-emerald-600/50 cursor-pointer"
                      >
                        ¡Envido!
                      </button>
                      <button
                        onClick={() => handlePlayerCantaEnvido('real_envido')}
                        className="px-2.5 py-1.5 rounded bg-[#1e4428] hover:bg-[#2a5d37] text-amber-200 font-mono font-bold border border-amber-600/50 cursor-pointer"
                      >
                        ¡Real Envido!
                      </button>
                      <button
                        onClick={() => handlePlayerCantaEnvido('falta_envido')}
                        className="px-2.5 py-1.5 rounded bg-[#2e1d1d] hover:bg-[#4d2828] text-red-300 font-mono font-bold border border-red-700/50 cursor-pointer"
                      >
                        ¡Falta Envido!
                      </button>
                    </>
                  )}

                  {/* Truco options */}
                  {trucoState === 'none' && (
                    <button
                      onClick={() => handlePlayerCantaTruco(2)}
                      className="px-3 py-1.5 rounded bg-[#B9902E] hover:bg-[#A37D24] text-black font-['Courier_Prime',monospace] font-bold shadow cursor-pointer"
                    >
                      ¡¡TRUCO!!
                    </button>
                  )}

                  {trucoState === 'truco_accepted' && (
                    <button
                      onClick={() => handlePlayerCantaTruco(3)}
                      className="px-3 py-1.5 rounded bg-[#B9902E] hover:bg-[#A37D24] text-black font-['Courier_Prime',monospace] font-bold shadow cursor-pointer"
                    >
                      ¡¡RETRUCO!!
                    </button>
                  )}

                  {trucoState === 'retruco_accepted' && (
                    <button
                      onClick={() => handlePlayerCantaTruco(4)}
                      className="px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-black font-['Courier_Prime',monospace] font-bold shadow cursor-pointer animate-pulse"
                    >
                      ¡¡VALE CUATRO!!
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Over Banner */}
        {gameOver && (
          <div className="p-4 bg-[#142e1b] border-t-2 border-[#B9902E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <span className="font-['Courier_Prime',monospace] font-bold text-sm text-white">
                  {winner === 'player' ? '¡VICTORIA EN EL TRUCO!' : 'PARTIDA TERMINADA'}
                </span>
                <p className="text-xs text-emerald-300 font-mono">
                  {winner === 'player'
                    ? 'Desbloqueaste la Baraja Fournier 1978 en la Vitrina de Souvenirs.'
                    : 'Garramuño te ganó los 15 puntos.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPlayerScore(0);
                  setOpponentScore(0);
                  setGameOver(false);
                  setWinner(null);
                  dealNewHand(true);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded bg-[#B9902E] hover:bg-[#A37D24] text-black font-mono text-xs font-bold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revancha</span>
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded bg-[#20472a] hover:bg-[#2d613a] text-white font-mono text-xs font-bold cursor-pointer"
              >
                Volver al Despacho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
