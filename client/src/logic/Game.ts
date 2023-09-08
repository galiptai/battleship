import { Coordinate } from "../components/gameplay/DrawBoard";
import { Board } from "./Board";
import { WhichPlayer } from "./OnlineGame";
import { Guess } from "./gameLogic";

export abstract class Game {
  player1: Board | null;
  player2: Board | null;
  guesses: Guess[];
  winner: WhichPlayer | null;

  constructor(
    player1: Board | null,
    player2: Board | null,
    guesses: Guess[],
    winner: WhichPlayer | null
  ) {
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
}
