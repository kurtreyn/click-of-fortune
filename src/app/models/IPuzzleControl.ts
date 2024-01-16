export interface IPuzzleControl {
    maxSpinCount?: number;
    spinCount?: number;
    score?: number;
    answerKey?: string[];
    correctGuessedLetters?: string[];
    allGuessedLetters?: string[];
    spinDisabled?: boolean;
    isWinner?: boolean;
}