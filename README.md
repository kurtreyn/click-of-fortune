<h1>Spin of Fortune</h1>

## Kurt Reynolds

- Created with `Angular v15`.
- Node version: `v18.14.2`

<h2>
Game Design & Logic
</h2>

- All of the puzzle data is stored in an array of objects in the `data/puzzleData.ts` file, and contains three properties: `id`, `category`, and `puzzle`.

```
    {
        id: '8',
        category: "places",
        puzzle: "rome"
    },
```

- Upon initialization of the app, the `apiService` is called in the `homeComponent` to retrieve the puzzle data from the `puzzleData.ts` file.
- The `homeComponent` then calls the `puzzleService` to set the puzzle data in the `puzzleService`
- The `homeComponent` then runs the method `setInitialPuzzle()` to set the initial puzzle to be displayed to the user, along with marking the current puzzle as used and pushing to the uzedPuzzles array, and pushing all un-used puzzles into the availablePuzzles array.
- From there, `updateGameDetails()` is called (also in the `homeComponent`) to set the `gameDetails` object in the `puzzleService` with the initial values.
- The `puzzleService` stores the `gameDetails` as a BehaviorSubject, so that any component can subscribe to it and receive updates when the `gameDetails` object is updated.

<h2>
Game Details
</h2>
- An `IGame` interface was created to define which properties of the games state that will be changing as the game progresses.

```
export interface IGame {
    allGuessedLetters?: string[];
    allPuzzles?: IPuzzle[];
    allPuzzlesCount?: number;
    allPuzzlesLength?: number;
    answerArr?: string[];
    answerLength?: number;
    answerString?: string;
    availablePuzzles?: IPuzzle[];
    correctGuessedLetters?: string[];
    correctGuessedString?: string;
    currentPuzzle?: IPuzzle;
    guessCount?: number;
    hasSpun?: boolean;
    hasWon?: boolean;
    incorrectGuessedLetters?: string[];
    indexRefArr?: string[];
    inputValues?: { letter: string };
    maskedPuzzleArr?: string[];
    maxGuess?: number;
    newPuzzle?: IPuzzle[];
    puzzleCategory?: string;
    puzzleId?: string;
    puzzleValue?: string;
    remainingGuess?: number;
    score?: number;
    spinActive?: boolean;
    spinDisabled?: boolean;
    spinValue?: number;
    startNewGame?: boolean;
    totalScore?: number;
    usedPuzzles?: string[];
    activePuzzle?: IPuzzle;
}
```
