import { Tile } from "../components/Tile";

export enum ShipType {
  "CAR" = "Carrier",
  "BAT" = "Battleship",
  "CRU" = "Cruiser",
  "SUB" = "Submarine",
  "DES" = "Destroyer",
}

export class Ship {
  type: ShipType;
  length: number;
  tiles: Tile[];

  constructor(type: ShipType, length: number, tiles: Tile[]) {
    this.type = type;
    this.length = length;
    this.tiles = tiles;
  }

  setTiles(tiles: Tile[]) {
    if (tiles.length !== this.length || tiles.some((tile) => tile.placedShip !== null)) {
      throw new Error("Ship can't be placed here!");
    } else {
      this.tiles = tiles;
      for (const tile of tiles) {
        tile.placedShip = this.type;
      }
    }
  }

  removeTiles() {
    for (const tile of this.tiles) {
      tile.placedShip = null;
    }
    this.tiles = [];
  }
}
