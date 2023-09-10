import { Coordinate } from "../components/gameplay/DrawBoard";
import { Board } from "./Board";
import { Game } from "./Game";
import { BoardData, PlainGameSave } from "./GameSave";
import { WhichPlayer } from "./OnlineGame";
import { RuleData, Rules } from "./Rules";
import { Guess } from "./gameLogic";

export class LocalGame extends Game {
  currentTurn: WhichPlayer;

  constructor(
    rules: RuleData,
    player1: Board | null,
    player2: Board | null,
    currentTurn: WhichPlayer,
    guesses: Guess[],
    winner: WhichPlayer | null
  ) {
    super(rules, player1, player2, guesses, winner);
    this.currentTurn = currentTurn;
  }

  static fromPlainGameSave(save: PlainGameSave): LocalGame {
    const rules = save.rules ? save.rules : Rules.CLASSIC_RULES;
    const player1 = save.p1Board !== null ? BoardData.fromJSON(save.p1Board).getBoard() : null;
    const player2 = save.p2Board !== null ? BoardData.fromJSON(save.p2Board).getBoard() : null;
    if (player1 !== null && player2 !== null) {
      this.processGuesses(player1, player2, save.guesses);
    }
    return new LocalGame(rules, player1, player2, save.currentTurn, save.guesses, null);
  }

  makeCopy(): LocalGame {
    return new LocalGame(
      this.rules,
      this.player1,
      this.player2,
      this.currentTurn,
      this.guesses,
      this.winner
    );
  }

  setBoard(whichPlayer: WhichPlayer, board: Board) {
    if (whichPlayer === "PLAYER1" && this.player1 === null) {
      this.player1 = board;
    } else if (whichPlayer === "PLAYER2" && this.player2 === null) {
      this.player2 = board;
    } else {
      throw new Error(`Board for ${whichPlayer} is already set.`);
    }
  }

  canGuess(coordinate: Coordinate): boolean {
    const opponentBoard = this.currentTurn === "PLAYER1" ? this.player2! : this.player1!;
    return opponentBoard.canGuess(coordinate);
  }

  makeGuess(coordinate: Coordinate) {
    const opponentBoard = this.currentTurn === "PLAYER1" ? this.player2! : this.player1!;
    const hit = opponentBoard.submitGuess(coordinate);
    this.guesses.push({ player: this.currentTurn, coordinate: coordinate, hit: hit });
    if (opponentBoard.checkAllBoatsSank()) {
      this.winner = this.currentTurn;
    }
  }

  pass() {
    if (this.currentTurn === "PLAYER1") {
      this.currentTurn = "PLAYER2";
    } else {
      this.currentTurn = "PLAYER1";
    }
  }
}
