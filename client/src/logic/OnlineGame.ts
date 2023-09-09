import { Coordinate } from "../components/gameplay/DrawBoard";
import { Board } from "./Board";
import { Game } from "./Game";
import { BoardData, PlainBoardData, PlainShipData } from "./GameSave";
import { Guess } from "./gameLogic";

export type OnlineGameData = {
  id: string;
  playerIs: WhichPlayer;
  privateGame: boolean;
  player1: PlainBoardData | null;
  player2: PlainBoardData | null;
  guesses: Guess[];
  gameState: GameState;
  winner: WhichPlayer | null;
};

export type GameState = "JOINING" | "SETUP" | "P1_TURN" | "P2_TURN" | "OVER" | "SUSPENDED";

export type WhichPlayer = "PLAYER1" | "PLAYER2";

export class OnlineGame extends Game {
  readonly id: string;
  gameState: GameState;
  readonly privateGame: boolean;
  readonly playerIs: WhichPlayer;

  constructor(
    id: string,
    gameState: GameState,
    privateGame: boolean,
    player1: Board | null,
    player2: Board | null,
    playerIs: WhichPlayer,
    guesses: Guess[],
    winner: WhichPlayer | null
  ) {
    super(player1, player2, guesses, winner);
    this.id = id;
    this.gameState = gameState;
    this.privateGame = privateGame;
    this.playerIs = playerIs;
  }

  static fromGameData(gameData: OnlineGameData): OnlineGame {
    const player1 = gameData.player1 ? BoardData.fromJSON(gameData.player1).getBoard() : null;
    const player2 = gameData.player2 ? BoardData.fromJSON(gameData.player2).getBoard() : null;

    if (player1 !== null && player2 !== null)
      this.processGuesses(player1, player2, gameData.guesses);
    return new OnlineGame(
      gameData.id,
      gameData.gameState,
      gameData.privateGame,
      player1,
      player2,
      gameData.playerIs,
      gameData.guesses,
      gameData.winner
    );
  }

  makeCopy(): OnlineGame {
    return new OnlineGame(
      this.id,
      this.gameState,
      this.privateGame,
      this.player1,
      this.player2,
      this.playerIs,
      this.guesses,
      this.winner
    );
  }

  getPlayerBoard(): Board | null {
    if (this.playerIs === "PLAYER1") {
      return this.player1;
    } else {
      return this.player2;
    }
  }

  setPlayerBoard(playerBoard: Board) {
    if (this.playerIs === "PLAYER1") {
      this.player1 = playerBoard;
    } else {
      this.player2 = playerBoard;
    }
  }

  getOpponentBoard(): Board | null {
    if (this.playerIs === "PLAYER1") {
      return this.player2;
    } else {
      return this.player1;
    }
  }

  setOpponentBoard(opponentBoard: Board) {
    for (const guess of this.guesses) {
      if (this.playerIs === guess.player) {
        opponentBoard.processGuess(guess);
      }
    }
    if (this.playerIs === "PLAYER1") {
      this.player2 = opponentBoard;
    } else {
      this.player1 = opponentBoard;
    }
  }

  canGuess(coordinate: Coordinate): boolean {
    return this.getOpponentBoard()!.canGuess(coordinate);
  }

  processGuess(guess: Guess) {
    this.guesses = [...this.guesses, guess];
    if (guess.player === "PLAYER1") {
      this.player2!.processGuess(guess);
    } else {
      this.player1!.processGuess(guess);
    }
  }

  processGuessSunk(guess: Guess, ship: PlainShipData) {
    this.guesses = [...this.guesses, guess];
    if (this.playerIs === "PLAYER1") {
      this.player2!.processGuessSunk(guess, ship);
    } else {
      this.player1!.processGuessSunk(guess, ship);
    }
  }

  playerIsWinner(): boolean {
    if (this.winner) {
      return this.playerIs === this.winner;
    } else {
      throw new Error("Game is not yet won");
    }
  }
}
