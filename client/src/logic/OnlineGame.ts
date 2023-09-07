import { Board } from "./Board";
import { BoardData, PlainBoardData } from "./GameSave";
import { Guess } from "./gameLogic";

export type GameData = {
  id: string;
  playerIs: WhichPlayer;
  privateGame: boolean;
  player: PlainBoardData | null;
  opponent: PlainBoardData | null;
  guesses: Guess[];
  gameState: GameState;
  winner: WhichPlayer | null;
};

export type GameState = "JOINING" | "SETUP" | "P1_TURN" | "P2_TURN" | "OVER" | "SUSPENDED";

export type WhichPlayer = "PLAYER1" | "PLAYER2";

export class OnlineGame {
  readonly id: string;
  gameState: GameState;
  readonly privateGame: boolean;
  player: Board | null;
  opponent: Board | null;
  readonly playerIs: WhichPlayer;
  guesses: Guess[];
  winner: WhichPlayer | null;

  constructor(
    id: string,
    gameState: GameState,
    privateGame: boolean,
    player: Board | null,
    opponent: Board | null,
    playerIs: WhichPlayer,
    guesses: Guess[],
    winner: WhichPlayer | null
  ) {
    this.id = id;
    this.gameState = gameState;
    this.privateGame = privateGame;
    this.player = player;
    this.opponent = opponent;
    this.playerIs = playerIs;
    this.guesses = guesses;
    this.winner = winner;
  }

  static fromGameData(gameData: GameData): OnlineGame {
    const player = gameData.player ? BoardData.fromJSON(gameData.player).getBoard() : null;
    const opponent = gameData.opponent ? BoardData.fromJSON(gameData.opponent).getBoard() : null;
    for (const guess of gameData.guesses) {
      if (gameData.playerIs === guess.player) {
        opponent!.processGuess(guess);
      } else {
        player!.processGuess(guess);
      }
    }
    return new OnlineGame(
      gameData.id,
      gameData.gameState,
      gameData.privateGame,
      player,
      opponent,
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
      this.player,
      this.opponent,
      this.playerIs,
      this.guesses,
      this.winner
    );
  }

  playerIsWinner(): boolean {
    if (this.winner) {
      return this.playerIs === this.winner;
    } else {
      throw new Error("Game is not yet won");
    }
  }

  getWinnerName(): string {
    if (this.playerIsWinner()) {
      return this.player!.player;
    } else {
      return this.opponent!.player;
    }
  }

  setOpponent(opponentBoard: Board) {
    this.opponent = opponentBoard;
    for (const guess of this.guesses) {
      if (this.playerIs === guess.player) {
        this.opponent.processGuess(guess);
      }
    }
  }
}
