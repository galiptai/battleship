import { Tile } from "../components/gameplay/Tile";

export class Ship {
  type: ShipType;
  tiles: Tile[];

  constructor(type: ShipType, tiles: Tile[]) {
    this.type = type;
    this.tiles = tiles;
  }

  setTiles(tiles: Tile[]) {
    if (tiles.length !== this.type.length || tiles.some((tile) => tile.placedShip !== null)) {
      throw new Error("Ship can't be placed here!");
    } else {
      this.tiles = tiles;
      for (const tile of tiles) {
        tile.placedShip = this;
      }
    }
  }

  removeTiles() {
    for (const tile of this.tiles) {
      tile.placedShip = null;
    }
    this.tiles = [];
  }

  isSank(): boolean {
    return this.tiles.every((tile) => tile.hit);
  }
}

export const SHIP_TYPES = {
  CARRIER: {
    name: "Carrier",
    length: 5,
  },
  BATTLESHIP: {
    name: "Battleship",
    length: 4,
  },
  CRUISER: {
    name: "Cruiser",
    length: 3,
  },
  SUBMARINE: {
    name: "Submarine",
    length: 3,
  },
  DESTROYER: {
    name: "Destroyer",
    length: 2,
  },
} as const;

export type ShipTypeKey = keyof typeof SHIP_TYPES;

export type ShipType = (typeof SHIP_TYPES)[ShipTypeKey];
