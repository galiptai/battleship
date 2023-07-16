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
  lenght: number;
  tiles: Tile[];

  constructor(type: ShipType, length: number, tiles: Tile[]) {
    this.type = type;
    this.lenght = length;
    this.tiles = tiles;
  }
}
