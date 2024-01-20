import { IPuzzle } from "./IPuzzle";

export interface IGame {
    allGuessedLetters?: string[];
    allPuzzles?: IPuzzle[];
    allPuzzlesCount?: number;
    allPuzzlesLength?: number;
    answerArr?: string[];
    answerLength?: number;
    answerString?: string;
    availablePuzzles?: IPuzzle[];
    canGuess?: boolean;
    correctGuessedLetters?: string[];
    correctGuessedString?: string;
    currentPuzzle?: IPuzzle;
    guessCount?: number;
    hasLost?: boolean;
    hasSpun?: boolean;
    hasWon?: boolean;
    inputValues?: { letter: string };
    indexRefArr?: string[];
    maskedPuzzleArr?: string[];
    maxGuess?: number;
    maxSpins?: number;
    newPuzzle?: IPuzzle[];
    puzzleCategory?: string;
    puzzleId?: string;
    puzzleValue?: string;
    remainingGuess?: number;
    score?: number;
    spinActive?: boolean;
    spinCount?: number;
    spinDisabled?: boolean;
    spinValue?: number;
    startNewGame?: boolean;
    totalScore?: number;
    usedPuzzles?: string[];
    activePuzzle?: IPuzzle;
}
