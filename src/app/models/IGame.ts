import { IPuzzle } from "./IPuzzle";

export interface IGame {
    allPuzzles?: IPuzzle[];
    allPuzzlesLength?: number;
    allPuzzlesCount?: number;
    activePuzzle?: IPuzzle;
    availablePuzzles?: IPuzzle[];
    usedPuzzles?: IPuzzle[];
    solvedPuzzles?: IPuzzle[];
    emptyPuzzleLetterArray?: string[];
    newPuzzle?: IPuzzle[];
    isEmpty?: boolean;
    puzzleId?: string;
    guessCount?: number;
    puzzleCategory?: string;
    puzzleValue?: string;
    maxSpins?: number;
    spinCount?: number;
    guessMax?: number;
    canGuess?: boolean;
    score?: number;
    inputValues?: { letter: string };
    answerKey?: string[];
    answerLength?: number;
    answerString?: string;
    correctGuessedLetters?: string[];
    correctGuessedString?: string;
    allGuessedLetters?: string[];
    spinDisabled?: boolean;
    hasSpun?: boolean;
    spinActive?: boolean;
    spinnerValue?: number;
    isPuzzleSolved?: boolean;
    isWinner?: boolean;
}
