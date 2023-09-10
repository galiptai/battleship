import { Coordinate } from "../components/gameplay/DrawBoard";
import { Board } from "./Board";
import { RuleData } from "./Rules";

export type WhichPlayer = "PLAYER1" | "PLAYER2";

export type Guess = {
  coordinate: Coordinate;
  hit: boolean;
  player: WhichPlayer;
};

export abstract class Game {
  readonly rules: RuleData;
  player1: Board | null;
  player2: Board | null;
  guesses: Guess[];
  winner: WhichPlayer | null;

  constructor(
    rules: RuleData,
    player1: Board | null,
    player2: Board | null,
    guesses: Guess[],
    winner: WhichPlayer | null
  ) {
    this.rules = rules;
    this.player1 = player1;
    this.player2 = player2;
    this.guesses = guesses;
    this.winner = winner;
  }

  protected static processGuesses(player1: Board, player2: Board, guesses: Guess[]) {
    for (const guess of guesses) {
      if (guess.player === "PLAYER1") {
        player2.processGuess(guess);
      } else {
        player1.processGuess(guess);
      }
    }
  }

  abstract makeCopy(): Game;

  abstract canGuess(coordinate: Coordinate): boolean;

  getWinnerName(): string {
    if (this.winner) {
      if (this.winner === "PLAYER1") {
        return this.player1!.player;
      } else {
        return this.player2!.player;
      }
    } else {
      throw new Error("Game is not yet won");
    }
  }
}
