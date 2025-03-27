import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Grid,
	Avatar,
	Chip,
	IconButton,
	Paper,
	Slider,
	styled,
	Snackbar,
	Alert,
	CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { CardCountingGame } from './cardCounting';
import { RouletteGame } from './roulette';

// Styled components for Kakegurui theme
const StyledDialog = styled(Dialog)({
	'& .MuiPaper-root': {
		backgroundColor: '#1E1E2D',
		color: '#fff',
		maxWidth: '90vw',
		width: '100%',
		maxHeight: '90vh',
		borderRadius: '12px',
		border: '2px solid #D30000',
	},
});

const GameHeader = styled(Box)({
	background: 'linear-gradient(135deg, #1E1E2D 0%, #2D0A0A 100%)',
	padding: '20px 20px 40px 20px',
	textAlign: 'center',
	position: 'relative',
	overflow: 'hidden',
	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background:
			"url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D30000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
		zIndex: 0,
	},
});

const MainTitle = styled(Typography)({
	fontFamily: '"Cinzel", serif',
	color: '#FFD700',
	fontWeight: 'bold',
	textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
	position: 'relative',
	zIndex: 1,
});

const CasinoCard = styled(Card)({
	backgroundColor: '#2E2E40',
	color: '#fff',
	borderRadius: '12px',
	border: '1px solid #3D3D55',
	transition: 'transform 0.3s ease, box-shadow 0.3s ease',
	overflow: 'hidden',
	'&:hover': {
		transform: 'translateY(-5px)',
		boxShadow: '0 10px 20px rgba(211, 0, 0, 0.2)',
	},
});

const GameInfoBox = styled(Box)({
	backgroundColor: '#272736',
	borderRadius: '8px',
	padding: '15px',
	marginBottom: '20px',
});

const BetSlider = styled(Slider)({
	color: '#D30000',
	'& .MuiSlider-thumb': {
		height: 24,
		width: 24,
		backgroundColor: '#fff',
		border: '2px solid #D30000',
		'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
			boxShadow: '0 0 0 8px rgba(211, 0, 0, 0.16)',
		},
	},
	'& .MuiSlider-track': {
		height: 8,
	},
	'& .MuiSlider-rail': {
		height: 8,
		opacity: 0.5,
		backgroundColor: '#3D3D55',
	},
});

const PlayerChip = styled(Chip)({
	backgroundColor: '#D30000',
	color: '#fff',
	fontWeight: 'bold',
	'& .MuiChip-icon': {
		color: '#FFD700',
	},
});

const ActionButton = styled(Button)({
	backgroundColor: '#D30000',
	color: '#fff',
	fontWeight: 'bold',
	borderRadius: '8px',
	padding: '10px 20px',
	'&:hover': {
		backgroundColor: '#FF0000',
	},
	'&.Mui-disabled': {
		backgroundColor: '#3D3D55',
		color: '#aaa',
	},
});

const GameCard = styled(Paper)({
	width: '100px',
	height: '140px',
	margin: '10px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#fff',
	borderRadius: '8px',
	position: 'relative',
	boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
	transition: 'transform 0.3s',
	cursor: 'pointer',
	'&:hover': {
		transform: 'scale(1.05)',
	},
});

const CardValue = styled(Typography)({
	fontSize: '24px',
	fontWeight: 'bold',
});

const CardBack = styled(Box)({
	width: '100%',
	height: '100%',
	backgroundColor: '#D30000',
	borderRadius: '8px',
	backgroundImage:
		"url(\"data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 0h44v44H0V0zm4 4h36v36H4V4zm10 10h16v16H14V14z'/%3E%3C/g%3E%3C/svg%3E\")",
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const GameAnimation = styled(Box)({
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '20px 0',
});

const InsanityEffect = styled(Box)({
	animation: 'pulse 1.5s infinite',
	'@keyframes pulse': {
		'0%': {
			transform: 'scale(1)',
			opacity: 1,
		},
		'50%': {
			transform: 'scale(1.05)',
			opacity: 0.8,
		},
		'100%': {
			transform: 'scale(1)',
			opacity: 1,
		},
	},
});

// Mock opponent data
const opponents = [
	{
		id: 1,
		name: 'House',
		avatar: 'https://i.imgur.com/bWcQnAW.jpg',
		difficulty: 'Hard',
		description: 'The house always wins. Play at your own risk.',
		specialty: 'Unbeatable odds',
		winRate: 0.92,
		style: 'High-risk, high-reward',
	},
];

// Games
const GAMES = {
	HIGHER_LOWER: 'higher_lower',
	MATCHING: 'matching',
	COIN_FLIP: 'coin_flip',
	SLOTS: 'slots',
	POKER: 'poker',
	CARD_COUNTING: 'card_counting',
	ROULETTE: 'roulette',
};

// Card games utils
const cardValues = [
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'J',
	'Q',
	'K',
	'A',
];
const cardSuits = ['♠', '♥', '♦', '♣'];

interface CasinoGameProps {
	open: boolean;
	onClose: () => void;
}

function CasinoGame({ open, onClose }: CasinoGameProps) {
	// Game state
	const [balance, setBalance] = useState(1000); // Starting balance
	const [selectedGame, setSelectedGame] = useState<string | null>(null);
	const [betAmount, setBetAmount] = useState(50);
	const [gameState, setGameState] = useState('selecting'); // selecting, betting, playing, result
	const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [alertSeverity, setAlertSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [insanityMode, setInsanityMode] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Card game specific states
	const [playerCard, setPlayerCard] = useState<string | null>(null);
	const [opponentCard, setOpponentCard] = useState<string | null>(null);
	const [prediction, setPrediction] = useState<'higher' | 'lower' | null>(
		null,
	);
	const [matchingCards, setMatchingCards] = useState<string[]>([]);
	const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
	const [lastRevealedIndex, setLastRevealedIndex] = useState<number | null>(
		null,
	);
	const [coinSide, setCoinSide] = useState<'heads' | 'tails' | null>(null);
	const [playerChoice, setPlayerChoice] = useState<'heads' | 'tails' | null>(
		null,
	);

	// Slots game states
	const [spinning, setSpinning] = useState(false);
	const [spinResult, setSpinResult] = useState<string[]>(['', '', '']);

	// Poker game states
	const [pokerHand, setPokerHand] = useState<string[]>([]);
	const [selectedCards, setSelectedCards] = useState<boolean[]>([
		false,
		false,
		false,
		false,
		false,
	]);
	const [pokerStage, setPokerStage] = useState<'initial' | 'draw'>('initial');
	const [pokerResult, setPokerResult] = useState<string>('');

	const getCardValue = (card: string) => {
		if (!card) return 0;
		const value = card.slice(0, -1); // Remove the suit
		switch (value) {
			case 'J':
				return 11;
			case 'Q':
				return 12;
			case 'K':
				return 13;
			case 'A':
				return 14;
			default:
				return parseInt(value, 10);
		}
	};

	// Evaluate poker hand strength
	const evaluatePokerHand = (hand: string[]) => {
		// Extract values and suits
		const values = hand.map((card) => card.slice(0, -1));
		const suits = hand.map((card) => card.slice(-1));

		// Count value frequencies
		const valueCounts = values.reduce(
			(counts, value) => {
				const updatedCounts = { ...counts };
				if (!updatedCounts[value]) updatedCounts[value] = 0;
				updatedCounts[value] += 1;
				return updatedCounts;
			},
			{} as Record<string, number>,
		);

		const valueFreq = Object.values(valueCounts).sort((a, b) => b - a);
		const isFlush = suits.every((suit) => suit === suits[0]);

		// Check for straight
		const valueIndices = values
			.map((v) => {
				const index = cardValues.indexOf(v);
				return index >= 0 ? index : parseInt(v, 10) - 2;
			})
			.sort((a, b) => a - b);

		const isSequential = valueIndices.every(
			(val, i) => i === 0 || val === valueIndices[i - 1] + 1,
		);
		const isStraight =
			isSequential ||
			// Check for A-2-3-4-5 straight
			(valueIndices[0] === 0 &&
				valueIndices[1] === 1 &&
				valueIndices[2] === 2 &&
				valueIndices[3] === 3 &&
				valueIndices[4] === 12);

		// Determine hand type and multiplier
		if (isFlush && isStraight) {
			const isRoyal =
				values.includes('10') &&
				values.includes('J') &&
				values.includes('Q') &&
				values.includes('K') &&
				values.includes('A');
			if (isRoyal) {
				return { hand: 'Royal Flush! 🤑', multiplier: 100 };
			}
			return { hand: 'Straight Flush! 🔥', multiplier: 50 };
		}

		if (valueFreq[0] === 4) {
			return { hand: 'Four of a Kind! 💪', multiplier: 20 };
		}

		if (valueFreq[0] === 3 && valueFreq[1] === 2) {
			return { hand: 'Full House! 🏠', multiplier: 10 };
		}

		if (isFlush) {
			return { hand: 'Flush! 💦', multiplier: 7 };
		}

		if (isStraight) {
			return { hand: 'Straight! ➡️', multiplier: 5 };
		}

		if (valueFreq[0] === 3) {
			return { hand: 'Three of a Kind! 👌', multiplier: 3 };
		}

		if (valueFreq[0] === 2 && valueFreq[1] === 2) {
			return { hand: 'Two Pair! ✌️', multiplier: 2 };
		}

		if (valueFreq[0] === 2) {
			return { hand: 'Pair! 👍', multiplier: 1 };
		}

		// Check for high card, compare to Jacks or Better
		const highCardValue = values
			.map((v) => {
				if (v === 'A') return 14;
				if (v === 'K') return 13;
				if (v === 'Q') return 12;
				if (v === 'J') return 11;
				return parseInt(v, 10);
			})
			.sort((a, b) => b - a)[0];

		if (highCardValue >= 11) {
			// J, Q, K, A
			return { hand: 'High Card (J or better)', multiplier: 0.5 };
		}

		return { hand: 'High Card', multiplier: 0 };
	};

	// Helper functions for difficulty modifiers
	const getDifficultyModifier = (difficulty: string): number => {
		if (difficulty === 'Hard') return 0.7;
		return 1;
	};

	const getWinChance = (difficulty: string): number => {
		if (difficulty === 'Hard') return 0.25;
		return 0.55;
	};

	// Helper function for coin flip result
	const getCoinFlipResult = (
		playerWins: boolean,
		choice: 'heads' | 'tails',
	): 'heads' | 'tails' => {
		if (playerWins) return choice;
		return choice === 'heads' ? 'tails' : 'heads';
	};

	const handleGameResult = (
		result: 'win' | 'lose',
		multiplier: number = 1,
	) => {
		setGameResult(result);
		setGameState('result');

		const winnings = result === 'win' ? betAmount * multiplier : -betAmount;

		// Apply opponent difficulty modifier
		let actualWinnings = winnings;
		if (result === 'win' && selectedGame) {
			const opponent = opponents.find(
				(o) => o.id === Number(selectedGame),
			);
			if (opponent) {
				const difficultyModifier = getDifficultyModifier(
					opponent.difficulty,
				);
				actualWinnings = Math.floor(winnings * difficultyModifier);
			}
		}

		setBalance((prev) => prev + actualWinnings);

		// Show result alert
		if (result === 'win') {
			const multiplierText =
				multiplier > 1 ? ` (${multiplier}x multiplier!)` : '';
			setAlertMessage(
				`Congratulations! You won ${actualWinnings} tokens${multiplierText}!`,
			);
			setAlertSeverity('success');
		} else {
			setAlertMessage(`You lost ${betAmount} tokens!`);
			setAlertSeverity('error');
		}
		setShowAlert(true);

		// Random chance for insanity mode after a few games
		if (Math.random() < 0.2 && balance > 1000) {
			setInsanityMode(true);
		}
	};

	// Handle card selection for poker
	const toggleCardSelection = (index: number) => {
		if (pokerStage !== 'initial') return;

		const newSelection = [...selectedCards];
		newSelection[index] = !newSelection[index];
		setSelectedCards(newSelection);
	};

	const setupMatchingGame = () => {
		// Create a deck of 8 cards (4 pairs)
		const allCards = cardSuits.flatMap((suit) =>
			cardValues.map((value) => `${value}${suit}`),
		);

		// Shuffle and pick 4 cards
		const shuffled = [...allCards].sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, 4);

		// Create pairs
		setMatchingCards(
			[...selected, ...selected].sort(() => 0.5 - Math.random()),
		);
		setRevealedIndices([]);
		setLastRevealedIndex(null);
	};

	// Handle initial poker deal
	const handlePokerDeal = () => {
		if (betAmount > balance) {
			setAlertMessage("You don't have enough balance for this bet!");
			setAlertSeverity('error');
			setShowAlert(true);
			return;
		}

		setIsLoading(true);

		// Create a deck of cards
		const deck = cardSuits.flatMap((suit) =>
			cardValues.map((value) => `${value}${suit}`),
		);

		// Shuffle the deck
		const shuffled = [...deck].sort(() => 0.5 - Math.random());

		// Deal 5 cards
		const hand = shuffled.slice(0, 5);

		setPokerHand(hand);
		setSelectedCards([false, false, false, false, false]);
		setPokerStage('initial');
		setPokerResult('');
		setIsLoading(false);
	};

	// Handle drawing new cards
	const handlePokerDraw = () => {
		setIsLoading(true);

		// Create a deck minus the cards already in hand
		const deck = cardSuits
			.flatMap((suit) => cardValues.map((value) => `${value}${suit}`))
			.filter((card) => !pokerHand.includes(card));

		// Shuffle the deck
		const shuffled = [...deck].sort(() => 0.5 - Math.random());

		// Keep selected cards, replace others
		const newHand = [...pokerHand];
		let drawnCardIndex = 0;

		for (let i = 0; i < 5; i += 1) {
			if (!selectedCards[i]) {
				newHand[i] = shuffled[drawnCardIndex];
				drawnCardIndex += 1;
			}
		}

		setPokerHand(newHand);
		setPokerStage('draw');

		// Evaluate hand strength
		const handResult = evaluatePokerHand(newHand);
		setPokerResult(handResult.hand);

		// Apply win multiplier based on hand strength
		if (handResult.multiplier > 0) {
			handleGameResult('win', handResult.multiplier);
		} else {
			handleGameResult('lose');
		}

		setIsLoading(false);
	};

	// Reset game state for game selection
	const resetGameState = () => {
		setGameResult(null);
		setPlayerCard(null);
		setOpponentCard(null);
		setPrediction(null);
		setMatchingCards([]);
		setRevealedIndices([]);
		setLastRevealedIndex(null);
		setCoinSide(null);
		setPlayerChoice(null);
		setSpinning(false);
		setSpinResult(['', '', '']);
		setPokerHand([]);
		setSelectedCards([false, false, false, false, false]);
		setPokerStage('initial');
		setPokerResult('');
	};

	// Reset game when dialog closes
	const resetGame = () => {
		setSelectedGame(null);
		setBetAmount(50);
		setGameState('selecting');
		resetGameState();
	};

	useEffect(() => {
		if (!open) {
			resetGame();
		}
	}, [open]);

	const handleGameSelect = (game: string) => {
		setSelectedGame(game);
		setGameState('betting');
		setBetAmount(50);
		resetGameState();
	};

	const handleBetChange = (_event: Event, newValue: number | number[]) => {
		setBetAmount(newValue as number);
	};

	const handleStartGame = () => {
		if (betAmount > balance) {
			setAlertMessage("You don't have enough balance for this bet!");
			setAlertSeverity('error');
			setShowAlert(true);
			return;
		}

		setGameState('playing');

		// Set up the specific game
		if (selectedGame === GAMES.HIGHER_LOWER) {
			const randomIdx = Math.floor(Math.random() * cardValues.length);
			const randomSuit =
				cardSuits[Math.floor(Math.random() * cardSuits.length)];
			setPlayerCard(`${cardValues[randomIdx]}${randomSuit}`);
		} else if (selectedGame === GAMES.COIN_FLIP) {
			// No setup needed yet
		} else if (selectedGame === GAMES.POKER) {
			handlePokerDeal();
		}
	};

	const handleHigherLowerPrediction = (choice: 'higher' | 'lower') => {
		setPrediction(choice);
		setIsLoading(true);

		// Simulate opponent drawing a card with some delay for suspense
		setTimeout(() => {
			const playerValue = getCardValue(playerCard!);
			let opponentValue;
			let result: 'win' | 'lose';

			// Get opponent difficulty factor
			let winChance = 0.5; // default 50/50
			if (selectedGame) {
				const opponent = opponents.find(
					(o) => o.id === Number(selectedGame),
				);
				if (opponent) {
					winChance = getWinChance(opponent.difficulty);
				}
			}

			// Determine result first based on difficulty
			result = Math.random() < winChance ? 'win' : 'lose';

			// Now set the card based on the predetermined result
			if (result === 'win') {
				// Player wins - card should match prediction
				if (choice === 'higher') {
					// Need a higher card
					const possibleValues = cardValues
						.map((v) => getCardValue(`${v}♠`))
						.filter((v) => v > playerValue);

					if (possibleValues.length > 0) {
						// Randomly select a value higher than player's
						opponentValue =
							possibleValues[
								Math.floor(
									Math.random() * possibleValues.length,
								)
							];
					} else {
						// Edge case: player has highest card, force loss instead
						result = 'lose';
						opponentValue =
							playerValue - (1 + Math.floor(Math.random() * 3));
						opponentValue = Math.max(2, opponentValue); // Don't go below 2
					}
				} else {
					// Need a lower card
					const possibleValues = cardValues
						.map((v) => getCardValue(`${v}♠`))
						.filter((v) => v < playerValue);

					if (possibleValues.length > 0) {
						// Randomly select a value lower than player's
						opponentValue =
							possibleValues[
								Math.floor(
									Math.random() * possibleValues.length,
								)
							];
					} else {
						// Edge case: player has lowest card, force loss instead
						result = 'lose';
						opponentValue =
							playerValue + (1 + Math.floor(Math.random() * 3));
						opponentValue = Math.min(14, opponentValue); // Don't go above Ace (14)
					}
				}
			} else {
				// Player loses - card should be opposite of prediction
				const needLowerOrEqual = choice === 'higher';
				const possibleValues = cardValues
					.map((v) => getCardValue(`${v}♠`))
					.filter((v) =>
						needLowerOrEqual ? v <= playerValue : v >= playerValue,
					);

				if (possibleValues.length > 0) {
					// Randomly select a value based on prediction
					opponentValue =
						possibleValues[
							Math.floor(Math.random() * possibleValues.length)
						];
				} else {
					// Edge case: force win instead
					result = 'win';
					opponentValue = needLowerOrEqual
						? playerValue + (1 + Math.floor(Math.random() * 3))
						: playerValue - (1 + Math.floor(Math.random() * 3));
					opponentValue = needLowerOrEqual
						? Math.min(14, opponentValue) // Don't go above Ace (14)
						: Math.max(2, opponentValue); // Don't go below 2
				}
			}

			// Convert opponentValue back to a card
			const opponentValueIndex = cardValues.findIndex(
				(v) => getCardValue(`${v}♠`) === opponentValue,
			);
			const randomSuit =
				cardSuits[Math.floor(Math.random() * cardSuits.length)];
			const opponentCardValue = `${cardValues[opponentValueIndex]}${randomSuit}`;
			setOpponentCard(opponentCardValue);

			handleGameResult(result);
			setIsLoading(false);
		}, 1500);
	};

	const handleCoinFlipChoice = (choice: 'heads' | 'tails') => {
		setPlayerChoice(choice);
		setIsLoading(true);

		// Simulate coin flip with some delay for suspense
		setTimeout(() => {
			// Base win chance adjusted by opponent difficulty
			const winChance = 0.25; // default 25/75

			// Determine result first
			const playerWins = Math.random() < winChance;

			// Set coin side based on the result
			const result = getCoinFlipResult(playerWins, choice);
			setCoinSide(result);

			handleGameResult(playerWins ? 'win' : 'lose');
			setIsLoading(false);
		}, 1500);
	};

	const handleCardReveal = (index: number) => {
		if (revealedIndices.includes(index) || isLoading) return;

		const newRevealedIndices = [...revealedIndices, index];
		setRevealedIndices(newRevealedIndices);

		if (lastRevealedIndex === null) {
			setLastRevealedIndex(index);
		} else {
			setIsLoading(true);
			// Check if the two cards match
			if (matchingCards[lastRevealedIndex] === matchingCards[index]) {
				// Match found
				if (newRevealedIndices.length === matchingCards.length) {
					// All cards matched - player wins
					setTimeout(() => {
						handleGameResult('win');
						setIsLoading(false);
					}, 1000);
				} else {
					setIsLoading(false);
				}
			} else {
				// No match - hide cards after a delay
				setTimeout(() => {
					setRevealedIndices(
						newRevealedIndices.filter(
							(i) => i !== lastRevealedIndex && i !== index,
						),
					);

					// Opponent gets a turn based on difficulty
					const opponentMatchChance = 0.7; // default

					const remainingIndices = Array.from({
						length: matchingCards.length,
					})
						.map((_, i) => i)
						.filter((i) => !newRevealedIndices.includes(i));

					if (
						remainingIndices.length >= 2 &&
						Math.random() < opponentMatchChance
					) {
						// Find matching cards in remaining
						const cardPairs = remainingIndices.reduce(
							(pairs, idx) => {
								const card = matchingCards[idx];
								const updatedPairs = { ...pairs };
								if (!updatedPairs[card])
									updatedPairs[card] = [];
								updatedPairs[card].push(idx);
								return updatedPairs;
							},
							{} as Record<string, number[]>,
						);

						const pairsFound = Object.values(cardPairs).filter(
							(indices) => indices.length === 2,
						);

						if (pairsFound.length > 0) {
							// Opponent found a pair
							const chosenPair =
								pairsFound[
									Math.floor(
										Math.random() * pairsFound.length,
									)
								];
							setTimeout(() => {
								setRevealedIndices([
									...newRevealedIndices.filter(
										(i) =>
											i !== lastRevealedIndex &&
											i !== index,
									),
									...chosenPair,
								]);

								// Check if all cards are now revealed
								if (
									newRevealedIndices.length -
										2 +
										chosenPair.length ===
									matchingCards.length
								) {
									handleGameResult('lose');
								}
								setIsLoading(false);
							}, 1000);
						} else {
							setIsLoading(false);
						}
					} else {
						setIsLoading(false);
					}

					setLastRevealedIndex(null);
				}, 1000);
			}
			setLastRevealedIndex(null);
		}
	};

	const handleSlotSpin = () => {
		if (betAmount > balance) {
			setAlertMessage("You don't have enough balance for this bet!");
			setAlertSeverity('error');
			setShowAlert(true);
			return;
		}

		setSpinning(true);
		setIsLoading(true);

		// Simulate slot machine spinning with randomized delay
		const symbols = ['🍒', '🍋', '7️⃣', '🍊', '💎'];
		const spinDuration = 2000 + Math.random() * 1000;

		// Animate spinning
		const spinInterval = setInterval(() => {
			setSpinResult([
				symbols[Math.floor(Math.random() * symbols.length)],
				symbols[Math.floor(Math.random() * symbols.length)],
				symbols[Math.floor(Math.random() * symbols.length)],
			]);
		}, 100);

		// Stop spinning after duration
		setTimeout(() => {
			clearInterval(spinInterval);

			// Determine final result with varied probabilities
			const finalResult: string[] = [];
			const random = Math.random();

			// Different win probabilities based on opponent difficulty
			const winProbability = 0.15; // default

			if (random < winProbability) {
				// Win - all symbols match or special win patterns
				const winSymbol =
					symbols[Math.floor(Math.random() * symbols.length)];

				// Special case for 7️⃣ (bigger win) or 💎 (jackpot)
				if (Math.random() < 0.1) {
					finalResult.push('7️⃣', '7️⃣', '7️⃣');
					handleGameResult('win', 3); // Triple multiplier
				} else if (Math.random() < 0.03) {
					finalResult.push('💎', '💎', '💎');
					handleGameResult('win', 5); // 5x multiplier for diamond jackpot
				} else {
					finalResult.push(winSymbol, winSymbol, winSymbol);
					handleGameResult('win', 2); // Standard win
				}
			} else {
				// Loss - random non-matching symbols
				const a = symbols[Math.floor(Math.random() * symbols.length)];
				let b;
				let c;

				do {
					b = symbols[Math.floor(Math.random() * symbols.length)];
				} while (b === a);

				// Occasionally have two matching symbols for "near miss" effect
				if (Math.random() < 0.4) {
					c = a;
					// If a and b match by chance, pick a different c
					if (a === b) {
						do {
							c =
								symbols[
									Math.floor(Math.random() * symbols.length)
								];
						} while (c === a);
					}
				} else {
					do {
						c = symbols[Math.floor(Math.random() * symbols.length)];
					} while (c === a || c === b);
				}

				finalResult.push(a, b, c);
				handleGameResult('lose');
			}

			setSpinResult(finalResult);
			setSpinning(false);
			setIsLoading(false);
		}, spinDuration);
	};

	const handlePlayAgain = () => {
		setGameState('betting');
		setGameResult(null);
		setPlayerCard(null);
		setOpponentCard(null);
		setPrediction(null);
		setCoinSide(null);
		setPlayerChoice(null);

		if (selectedGame === GAMES.MATCHING) {
			setupMatchingGame();
		}
	};

	const handleAlertClose = () => {
		setShowAlert(false);
	};

	// Add a helper function to generate unique card IDs
	const generateCardId = (card: string, position: number): string => {
		const cardValue = card.slice(0, -1); // Remove suit
		const cardSuit = card.slice(-1); // Get suit
		return `match-card-${cardValue}-${cardSuit}-${position}`;
	};

	const renderGameSelection = () => (
		<Box sx={{ py: 3 }}>
			<MainTitle variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
				Choose Your Game of Chance
			</MainTitle>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.HIGHER_LOWER)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Higher or Lower
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Predict if the next card will be higher or
									lower than yours.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.HIGHER_LOWER)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Higher or Lower
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.MATCHING)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Memory Match
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Find all matching pairs before your
									opponent.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.MATCHING)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Memory Match
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.COIN_FLIP)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Coin Flip
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Bet on heads or tails in this classic game
									of chance.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.COIN_FLIP)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Coin Flip
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard onClick={() => handleGameSelect(GAMES.SLOTS)}>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Slots
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Test your luck with the slot machine. Match
									symbols to win!
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.SLOTS)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Slots
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard onClick={() => handleGameSelect(GAMES.POKER)}>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Poker
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Play Five Card Draw. Keep the cards you
									want, draw new ones for a winning hand.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.POKER)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Poker
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						onClick={() => handleGameSelect(GAMES.CARD_COUNTING)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Card Counting
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									Learn and practice card counting techniques
									to improve your blackjack game.
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.CARD_COUNTING)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Card Counting
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<CasinoCard
						sx={{
							transform: 'translateY(0)',
							transition: 'transform 0.3s ease',
							'&:hover': {
								transform: 'translateY(-10px)',
							},
						}}
						onClick={() => handleGameSelect(GAMES.ROULETTE)}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										width: 80,
										height: 80,
										backgroundColor: '#D30000',
									}}
								>
									<Typography
										variant="h5"
										sx={{ fontWeight: 'bold' }}
									>
										Roulette
									</Typography>
								</Avatar>
								<Typography
									variant="body2"
									sx={{ textAlign: 'center', minHeight: 60 }}
								>
									The classic casino game of chance. Place
									your bets on numbers, colors, or groups and
									watch the wheel spin!
								</Typography>
								<ActionButton
									variant="contained"
									fullWidth
									onClick={() =>
										handleGameSelect(GAMES.ROULETTE)
									}
									startIcon={<AttachMoneyIcon />}
								>
									Play Roulette
								</ActionButton>
							</Box>
						</CardContent>
					</CasinoCard>
				</Grid>
			</Grid>
		</Box>
	);

	const renderBettingUI = () => (
		<Box>
			<GameInfoBox>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Place Your Bet
				</Typography>
				<Typography variant="body2" sx={{ mb: 2 }}>
					How much are you willing to risk?
				</Typography>

				<Box sx={{ mb: 2 }}>
					<BetSlider
						value={betAmount}
						onChange={handleBetChange}
						min={10}
						max={Math.min(1000, balance)}
						step={10}
						valueLabelDisplay="on"
						valueLabelFormat={(value) => `${value} tokens`}
					/>
				</Box>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<PlayerChip
						icon={<AttachMoneyIcon />}
						label={`Balance: ${balance} tokens`}
					/>
					<ActionButton onClick={handleStartGame}>
						Start Game
					</ActionButton>
				</Box>
			</GameInfoBox>
		</Box>
	);

	const renderHigherLowerGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Your Card
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
				<GameCard>
					<CardValue>{playerCard}</CardValue>
				</GameCard>
			</Box>

			{!prediction ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
					<ActionButton
						onClick={() => handleHigherLowerPrediction('higher')}
					>
						Higher
					</ActionButton>
					<ActionButton
						onClick={() => handleHigherLowerPrediction('lower')}
					>
						Lower
					</ActionButton>
				</Box>
			) : (
				<Box>
					<Typography
						variant="h6"
						sx={{ mb: 2, textAlign: 'center' }}
					>
						You predicted: {prediction.toUpperCase()}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: 3,
						}}
					>
						<GameCard>
							<CardValue>{playerCard}</CardValue>
						</GameCard>

						{isLoading ? (
							<CircularProgress color="secondary" />
						) : (
							<GameCard>
								{opponentCard ? (
									<CardValue>{opponentCard}</CardValue>
								) : (
									<CardBack />
								)}
							</GameCard>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);

	const renderMatchingGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Find the matching pairs
			</Typography>

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					flexWrap: 'wrap',
					maxWidth: '500px',
					margin: '0 auto',
				}}
			>
				{matchingCards.map((card, index) => (
					<GameCard
						key={generateCardId(card, index)}
						onClick={() =>
							!revealedIndices.includes(index) &&
							!isLoading &&
							handleCardReveal(index)
						}
						sx={{
							cursor: revealedIndices.includes(index)
								? 'default'
								: 'pointer',
						}}
					>
						{revealedIndices.includes(index) ? (
							<CardValue>{card}</CardValue>
						) : (
							<CardBack />
						)}
					</GameCard>
				))}
			</Box>
		</Box>
	);

	const renderCoinFlipGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Heads or Tails?
			</Typography>

			{!playerChoice ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mb: 3,
						}}
					>
						<Avatar
							sx={{
								width: 80,
								height: 80,
								bgcolor: 'gold',
								color: 'black',
							}}
						>
							<Typography variant="h5">?</Typography>
						</Avatar>
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 2,
						}}
					>
						<ActionButton
							onClick={() => handleCoinFlipChoice('heads')}
						>
							Heads
						</ActionButton>
						<ActionButton
							onClick={() => handleCoinFlipChoice('tails')}
						>
							Tails
						</ActionButton>
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography variant="body1" sx={{ mb: 2 }}>
						You chose: {playerChoice.toUpperCase()}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mb: 3,
						}}
					>
						{isLoading ? (
							<CircularProgress color="secondary" />
						) : (
							<Avatar
								sx={{
									width: 80,
									height: 80,
									bgcolor: 'gold',
									color: 'black',
								}}
							>
								<Typography variant="h5">
									{coinSide === 'heads' ? 'H' : 'T'}
								</Typography>
							</Avatar>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);

	const renderSlotReels = (reels: string[], isSpinning: boolean) => (
		<>
			{reels.map((symbol, index) => {
				const keyName = `slot-reel-${index}`;
				const keyframeAnimation = isSpinning
					? `spin${index} 0.2s infinite`
					: 'none';

				return (
					<Box
						key={keyName}
						sx={{
							width: '80px',
							height: '100px',
							bgcolor: '#000',
							borderRadius: '5px',
							border: '1px solid #333',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '2.5rem',
							animation: keyframeAnimation,
							'@keyframes spin0': {
								'0%': { transform: 'translateY(-10px)' },
								'100%': { transform: 'translateY(10px)' },
							},
							'@keyframes spin1': {
								'0%': { transform: 'translateY(-15px)' },
								'100%': { transform: 'translateY(15px)' },
							},
							'@keyframes spin2': {
								'0%': { transform: 'translateY(-20px)' },
								'100%': { transform: 'translateY(20px)' },
							},
						}}
					>
						{symbol || '?'}
					</Box>
				);
			})}
		</>
	);

	const renderPokerCards = (
		hand: string[],
		selected: boolean[],
		stage: string,
		loading: boolean,
		onCardSelect: (index: number) => void,
	) => (
		<>
			{hand.map((card, index) => {
				const keyName = `poker-card-${index}`;
				const isSelected = selected[index];
				const isInitialStage = stage === 'initial';
				const cardColor =
					card.endsWith('♥') || card.endsWith('♦')
						? 'red'
						: 'black';

				return (
					<GameCard
						key={keyName}
						onClick={() => isInitialStage && onCardSelect(index)}
						sx={{
							transform: isSelected
								? 'translateY(-15px)'
								: 'none',
							cursor: isInitialStage ? 'pointer' : 'default',
							border: isSelected
								? '2px solid #FFD700'
								: undefined,
							opacity: loading ? 0.7 : 1,
							transition: 'transform 0.2s, border 0.2s',
						}}
					>
						<CardValue
							sx={{
								color: cardColor,
								fontSize: '1.25rem',
							}}
						>
							{card}
						</CardValue>
					</GameCard>
				);
			})}
		</>
	);

	const renderSlotsGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Slot Machine
			</Typography>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						gap: 2,
						mb: 4,
						bgcolor: 'rgba(0,0,0,0.3)',
						p: 3,
						borderRadius: '10px',
						border: '2px solid #D30000',
						boxShadow: '0 0 15px rgba(211, 0, 0, 0.3) inset',
						width: 'fit-content',
					}}
				>
					{renderSlotReels(spinResult, spinning)}
				</Box>

				<ActionButton
					onClick={handleSlotSpin}
					disabled={spinning || isLoading}
					sx={{ minWidth: '150px' }}
				>
					{spinning ? 'Spinning...' : 'Spin'}
				</ActionButton>

				<Box sx={{ mt: 3, textAlign: 'center' }}>
					<Typography
						variant="caption"
						sx={{ color: '#aaa', display: 'block', mb: 1 }}
					>
						Payouts
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: 2,
							justifyContent: 'center',
							flexWrap: 'wrap',
						}}
					>
						<Chip
							label="🍒🍒🍒 = 2x"
							size="small"
							sx={{ bgcolor: '#572424' }}
						/>
						<Chip
							label="🍋🍋🍋 = 2x"
							size="small"
							sx={{ bgcolor: '#572424' }}
						/>
						<Chip
							label="🍊🍊🍊 = 2x"
							size="small"
							sx={{ bgcolor: '#572424' }}
						/>
						<Chip
							label="7️⃣7️⃣7️⃣ = 3x"
							size="small"
							sx={{ bgcolor: '#8B0000' }}
						/>
						<Chip
							label="💎💎💎 = 5x"
							size="small"
							sx={{ bgcolor: '#4B0082' }}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);

	const renderPokerGame = () => (
		<Box>
			<Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
				Five Card Draw Poker
			</Typography>

			{pokerResult && (
				<Box sx={{ textAlign: 'center', mb: 2 }}>
					<Typography
						variant="h6"
						color={pokerResult.includes('!') ? '#FFD700' : '#aaa'}
					>
						{pokerResult}
					</Typography>
				</Box>
			)}

			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
				{renderPokerCards(
					pokerHand,
					selectedCards,
					pokerStage,
					isLoading,
					toggleCardSelection,
				)}
			</Box>

			{isLoading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress color="secondary" />
				</Box>
			) : (
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					{pokerStage === 'initial' ? (
						<ActionButton onClick={handlePokerDraw}>
							Draw New Cards
						</ActionButton>
					) : (
						<ActionButton onClick={handlePokerDeal}>
							Deal New Hand
						</ActionButton>
					)}
				</Box>
			)}

			<Box sx={{ mt: 4, textAlign: 'center' }}>
				<Typography
					variant="caption"
					sx={{ color: '#aaa', display: 'block', mb: 1 }}
				>
					Payouts
				</Typography>
				<Grid
					container
					spacing={1}
					sx={{ maxWidth: '600px', margin: '0 auto' }}
				>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Pair: 1x"
							size="small"
							sx={{ bgcolor: '#3F3F5F' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Two Pair: 2x"
							size="small"
							sx={{ bgcolor: '#3F3F5F' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Three of a Kind: 3x"
							size="small"
							sx={{ bgcolor: '#3F3F5F' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Straight: 5x"
							size="small"
							sx={{ bgcolor: '#4A4A6A' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Flush: 7x"
							size="small"
							sx={{ bgcolor: '#4A4A6A' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Full House: 10x"
							size="small"
							sx={{ bgcolor: '#5A5A7A' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Four of a Kind: 20x"
							size="small"
							sx={{ bgcolor: '#8B0000' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Straight Flush: 50x"
							size="small"
							sx={{ bgcolor: '#4B0082' }}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<Chip
							label="Royal Flush: 100x"
							size="small"
							sx={{ bgcolor: '#550000', color: '#FFD700' }}
						/>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);

	const renderGameContent = () => {
		if (gameState === 'selecting') {
			return renderGameSelection();
		}

		if (selectedGame === GAMES.CARD_COUNTING) {
			return (
				<CardCountingGame
					onWin={(multiplier: number) =>
						handleGameResult('win', multiplier || 1)
					}
					onLose={() => handleGameResult('lose')}
					balance={balance}
					betAmount={betAmount}
				/>
			);
		}

		if (selectedGame === GAMES.ROULETTE) {
			return (
				<RouletteGame
					open
					onClose={() => {
						resetGame();
						setSelectedGame(null);
						setGameState('selecting');
					}}
					initialBalance={balance}
				/>
			);
		}

		switch (selectedGame) {
			case GAMES.HIGHER_LOWER:
				return renderHigherLowerGame();
			case GAMES.MATCHING:
				return renderMatchingGame();
			case GAMES.COIN_FLIP:
				return renderCoinFlipGame();
			case GAMES.SLOTS:
				return renderSlotsGame();
			case GAMES.POKER:
				return renderPokerGame();
			default:
				return null;
		}
	};

	const renderGameResultUI = () => {
		const opponent = selectedGame
			? opponents.find((o) => o.id === Number(selectedGame))
			: null;

		return (
			<Box>
				<GameAnimation>
					{gameResult === 'win' ? (
						<Box sx={{ textAlign: 'center' }}>
							<CelebrationIcon
								sx={{
									fontSize: '4rem',
									color: '#FFD700',
									mb: 2,
								}}
							/>
							<Typography
								variant="h4"
								color="#FFD700"
								fontWeight="bold"
							>
								YOU WIN!
							</Typography>
						</Box>
					) : (
						<Box sx={{ textAlign: 'center' }}>
							<SentimentVeryDissatisfiedIcon
								sx={{
									fontSize: '4rem',
									color: '#D30000',
									mb: 2,
								}}
							/>
							<Typography
								variant="h4"
								color="#D30000"
								fontWeight="bold"
							>
								YOU LOSE
							</Typography>
						</Box>
					)}
				</GameAnimation>

				{opponent && (
					<Box sx={{ textAlign: 'center', mb: 3 }}>
						<Typography variant="body1">
							{gameResult === 'win'
								? `You defeated ${opponent.name}!`
								: `${opponent.name} defeated you!`}
						</Typography>
					</Box>
				)}

				<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
					<PlayerChip
						icon={<AttachMoneyIcon />}
						label={`Balance: ${balance} tokens`}
					/>
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
					<ActionButton onClick={handlePlayAgain}>
						Play Again
					</ActionButton>
					<Button
						variant="outlined"
						onClick={() => {
							setGameState('selecting');
							setSelectedGame(null);
						}}
						sx={{
							borderColor: '#D30000',
							color: '#fff',
							'&:hover': {
								borderColor: '#FF0000',
								backgroundColor: 'rgba(211, 0, 0, 0.1)',
							},
						}}
					>
						Change Game
					</Button>
				</Box>

				{insanityMode && gameResult === 'lose' && (
					<InsanityEffect
						sx={{
							mt: 3,
							p: 2,
							borderRadius: '8px',
							border: '1px solid #D30000',
						}}
					>
						<Typography
							variant="body1"
							color="#D30000"
							fontWeight="bold"
							textAlign="center"
						>
							&quot;The greater the risk, the greater the reward.
							Double your bet next time?&quot;
						</Typography>
					</InsanityEffect>
				)}
			</Box>
		);
	};

	return (
		<StyledDialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			disableEscapeKeyDown={false}
			onBackdropClick={onClose}
		>
			<GameHeader>
				<Box
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						zIndex: 1000,
					}}
				>
					<IconButton
						onClick={onClose}
						sx={{ color: '#fff' }}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
				</Box>

				<MainTitle variant="h3">CMUEats Private Academy</MainTitle>
				<Typography
					variant="h5"
					sx={{ color: '#ccc', mt: 1, mb: 2, lineHeight: 1.4 }}
				>
					CMUEats: The Ultimate Gambling Experience
				</Typography>
			</GameHeader>

			<DialogContent
				sx={{
					backgroundColor: '#1E1E2D',
					position: 'relative',
					padding: '20px 20px 40px 20px',
				}}
			>
				{gameState === 'selecting' && renderGameSelection()}

				{gameState === 'betting' && renderBettingUI()}

				{gameState === 'playing' && renderGameContent()}

				{gameState === 'result' && renderGameResultUI()}
			</DialogContent>

			<Snackbar
				open={showAlert}
				autoHideDuration={4000}
				onClose={handleAlertClose}
			>
				<Alert
					onClose={handleAlertClose}
					severity={alertSeverity}
					sx={{ width: '100%' }}
				>
					{alertMessage}
				</Alert>
			</Snackbar>
		</StyledDialog>
	);
}

export default CasinoGame;
