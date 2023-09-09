import { Coordinate } from "../components/gameplay/DrawBoard";
import { Tile } from "../components/gameplay/Tile";
import { PlainShipData } from "./GameSave";
import { SHIP_TYPES, Ship } from "./Ship";
import { Guess } from "./gameLogic";

export class Board {
  player: string;
  height: number;
  width: number;
  ships: Set<Ship>;
  tiles: Tile[][];

  constructor(player: string, height: number, width: number, ships: Set<Ship>, tiles: Tile[][]) {
    this.player = player;
    this.height = height;
    this.width = width;
    this.ships = ships;
    this.tiles = tiles;
  }

  makeCopy(): Board {
    return new Board(this.player, this.height, this.width, this.ships, this.tiles);
  }

  isValid() {
    if (this.player === "") {
      return false;
    }
    if (this.ships.size !== 5) {
      return false;
    }
    for (const ship of this.ships) {
      if (!this.checkNeighborsEmpty(ship.tiles)) {
        return false;
      }
    }
    return true;
  }

  checkAllBoatsSank(): boolean {
    return [...this.ships].every((ship) => ship.isSank());
  }

  addShip(ship: Ship, startCoordinate: Coordinate, vertical: boolean) {
    if (!this.ships.has(ship) && this.canAddShip(ship, startCoordinate, vertical)) {
      ship.setTiles(this.getTiles(ship.type.length, startCoordinate, vertical));
      this.ships.add(ship);
    }
  }
  getTiles(length: number, startCoordinate: Coordinate, vertical: boolean): Tile[] {
    const tiles: Tile[] = [];
    for (let i = 0; i < length; i++) {
      const tile: Tile | undefined =
        this.tiles[startCoordinate.y + (vertical ? i : 0)]?.[
          startCoordinate.x + (vertical ? 0 : i)
        ];
      if (tile) {
        tiles.push(tile);
      }
    }
    return tiles;
  }

  canAddShip(ship: Ship, startCoordinate: Coordinate, vertical: boolean): boolean {
    const tiles = this.getTiles(ship.type.length, startCoordinate, vertical);
    return (
      tiles.length === ship.type.length &&
      tiles.every((tile) => tile.placedShip === null) &&
      this.checkNeighborsEmpty(tiles)
    );
  }

  checkNeighborsEmpty(tiles: Tile[], range = 1): boolean {
    const neighbors: Set<Tile> = new Set();
    for (const tile of tiles) {
      const yStart = Math.max(0, tile.coordinate.y - range);
      const yLimit = Math.min(this.height - 1, tile.coordinate.y + range);
      for (let y = yStart; y <= yLimit; y++) {
        const xStart = Math.max(0, tile.coordinate.x - range);
        const xLimit = Math.min(this.width - 1, tile.coordinate.x + range);
        for (let x = xStart; x <= xLimit; x++) {
          neighbors.add(this.tiles[y][x]);
        }
      }
    }
    for (const tile of tiles) {
      neighbors.delete(tile);
    }
    return [...neighbors].every((tile) => tile.placedShip === null);
  }

  canGuess(coordinate: Coordinate): boolean {
    return !this.tiles[coordinate.y][coordinate.x].guessed;
  }

  submitGuess(coordinate: Coordinate): boolean {
    const tile = this.tiles[coordinate.y][coordinate.x];
    if (tile.guessed) {
      throw new Error("This tile was already guessed!");
    }
    tile.guessed = true;
    return tile.placedShip !== null;
  }

  processGuess(guess: Guess) {
    const tile = this.tiles[guess.coordinate.y][guess.coordinate.x];
    tile.guessed = true;
    if (guess.hit && tile.placedShip === null) {
      tile.placedShip = new Ship(SHIP_TYPES.UNKNOWN, [tile]);
    }
  }

  processGuessSunk(guess: Guess, shipData: PlainShipData) {
    const tile = this.tiles[guess.coordinate.y][guess.coordinate.x];
    tile.guessed = true;
    const { type, startingCoordinate, vertical } = shipData;
    this.#clearUnknownShip(SHIP_TYPES[type].length, startingCoordinate, vertical);
    this.addShip(new Ship(SHIP_TYPES[type], []), startingCoordinate, vertical);
  }

  #clearUnknownShip(length: number, startCoordinate: Coordinate, vertical: boolean) {
    for (let i = 0; i < length; i++) {
      const tile: Tile | undefined =
        this.tiles[startCoordinate.y + (vertical ? i : 0)]?.[
          startCoordinate.x + (vertical ? 0 : i)
        ];
      if (tile && tile.placedShip?.type === SHIP_TYPES.UNKNOWN) {
        tile.placedShip = null;
      }
    }
  }
}
