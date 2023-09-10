import { Coordinate } from "../components/gameplay/DrawBoard";
import { Tile } from "../components/gameplay/Tile";
import { Board } from "./Board";
import { LocalGame } from "./LocalGame";
import { WhichPlayer } from "./OnlineGame";
import { RuleData, Rules } from "./Rules";
import { SHIP_TYPES, Ship, ShipTypeKey } from "./Ship";
import { Guess } from "./gameLogic";
import deepEqual from "deep-eql";

export class GameSave {
  rules?: RuleData;
  p1Board: BoardData | null;
  p2Board: BoardData | null;
  currentTurn: WhichPlayer;
  guesses: Guess[];
  saveDate: Date;

  constructor(
    p1Board: BoardData | null,
    p2Board: BoardData | null,
    currentTurn: WhichPlayer,
    guesses: Guess[],
    saveDate: Date,
    rules?: RuleData
  ) {
    this.p1Board = p1Board;
    this.p2Board = p2Board;
    this.currentTurn = currentTurn;
    this.guesses = guesses;
    this.saveDate = saveDate;
    this.rules = rules;
  }

  static fromLocalGame(game: LocalGame, saveDate: Date): GameSave {
    let currentTurn: WhichPlayer = "PLAYER1";
    if (game.guesses.length > 0) {
      currentTurn = game.guesses.at(-1)!.player === "PLAYER1" ? "PLAYER2" : "PLAYER1";
    }
    const rules = deepEqual(game.rules, Rules.CLASSIC_RULES) ? undefined : game.rules;
    return new GameSave(
      BoardData.getDataFromBoard(game.player1),
      BoardData.getDataFromBoard(game.player2),
      currentTurn,
      game.guesses,
      saveDate,
      rules
    );
  }

  static fromJSON(json: PlainGameSave): GameSave {
    return new GameSave(
      json.p1Board === null ? json.p1Board : BoardData.fromJSON(json.p1Board),
      json.p2Board === null ? json.p2Board : BoardData.fromJSON(json.p2Board),
      json.currentTurn,
      json.guesses,
      new Date(json.saveDate),
      json.rules
    );
  }

  isValid(): boolean {
    if (this.p1Board === null || this.p2Board === null) {
      return false;
    }
    if (!this.getP1Board()?.isValid() || !this.getP2Board()?.isValid()) {
      return false;
    }
    return true;
  }

  getSaveData(): SaveData {
    return {
      player1: this.p1Board?.player || "Player 1",
      player2: this.p2Board?.player || "Player 2",
      date: this.saveDate,
    };
  }

  getGame(): LocalGame {
    return new LocalGame(
      this.rules ? this.rules : Rules.CLASSIC_RULES,
      this.getP1Board(),
      this.getP2Board(),
      this.currentTurn,
      this.guesses,
      null
    );
  }

  getP1Board(): Board | null {
    if (this.p1Board === null) {
      return this.p1Board;
    } else {
      const p1Board = this.p1Board.getBoard();
      this.#registerGuesses(p1Board, "PLAYER1");
      return p1Board;
    }
  }

  getP2Board(): Board | null {
    if (this.p2Board === null) {
      return this.p2Board;
    } else {
      const p2Board = this.p2Board.getBoard();
      this.#registerGuesses(p2Board, "PLAYER2");
      return p2Board;
    }
  }

  getP1TurnNext(): boolean {
    return this.guesses.length % 2 === 0;
  }

  #registerGuesses(board: Board, whichPlayer: WhichPlayer) {
    for (const guess of this.guesses) {
      if (guess.player !== whichPlayer) {
        board.tiles[guess.coordinate.y][guess.coordinate.x].guessed = true;
      }
    }
  }
}

export class BoardData {
  player: string;
  height: number;
  width: number;
  ships: ShipData[];

  constructor(player: string, height: number, width: number, ships: ShipData[]) {
    this.player = player;
    this.height = height;
    this.width = width;
    this.ships = ships;
  }

  static getDataFromBoard(board: Board | null): BoardData | null {
    if (board === null) {
      return board;
    } else {
      return new BoardData(
        board.player,
        board.height,
        board.width,
        [...board.ships].map((ship) => ShipData.getDataFromShip(ship))
      );
    }
  }
  static fromJSON(json: PlainBoardData): BoardData {
    return new BoardData(
      json.player,
      json.height,
      json.width,
      json.ships.map((ship) => new ShipData(ship.type, ship.startingCoordinate, ship.vertical))
    );
  }

  getBoard(): Board {
    const tiles: Tile[][] = [];
    for (let y = 0; y < this.height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < this.width; x++) {
        row[x] = { coordinate: { y, x }, guessed: false, placedShip: null };
      }
      tiles[y] = row;
    }
    const board = new Board(this.player, this.height, this.width, new Set(), tiles);
    for (const ship of this.ships) {
      board.addShip(new Ship(SHIP_TYPES[ship.type], []), ship.startingCoordinate, ship.vertical);
    }
    return board;
  }
}

class ShipData {
  type: ShipTypeKey;
  startingCoordinate: Coordinate;
  vertical: boolean;

  constructor(type: ShipTypeKey, startingCoordinate: Coordinate, vertical: boolean) {
    this.type = type;
    this.startingCoordinate = startingCoordinate;
    this.vertical = vertical;
  }

  static getDataFromShip(ship: Ship): ShipData {
    const startingCoordinate = ship.tiles[0].coordinate;
    let vertical = false;
    if (ship.type.length > 1) {
      if (ship.tiles[1].coordinate.x === startingCoordinate.x) {
        vertical = true;
      }
    }
    return new ShipData(ship.type.name.toUpperCase() as ShipTypeKey, startingCoordinate, vertical);
  }
}

export type PlainGameSave = {
  rules?: RuleData;
  p1Board: PlainBoardData | null;
  p2Board: PlainBoardData | null;
  currentTurn: WhichPlayer;
  guesses: Guess[];
  saveDate: string;
};

export type SaveData = {
  player1: string;
  player2: string;
  date: Date;
};

export type PlainBoardData = {
  player: string;
  height: number;
  width: number;
  ships: PlainShipData[];
};

export type PlainShipData = {
  type: ShipTypeKey;
  startingCoordinate: Coordinate;
  vertical: boolean;
};
