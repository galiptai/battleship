import { Coordinate } from "../components/gameplay/DrawBoard";
import { Tile } from "../components/gameplay/Tile";
import { Board } from "./Board";
import { Ship, ShipType } from "./Ship";

export type Guess = {
  coordinate: Coordinate;
  hit: boolean;
  player: string;
};

export function createEmptyBoard(height = 10, width = 10, name = "Player"): Board {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < 10; x++) {
      row[x] = { coordinate: { y, x }, hit: false, placedShip: null };
    }
    tiles[y] = row;
  }
  const ships: Set<Ship> = new Set();
  return new Board(name, height, width, ships, tiles);
}

export function getShips(): Ship[] {
  const ships: Ship[] = [];
  ships.push(new Ship(ShipType.CAR, 5, []));
  ships.push(new Ship(ShipType.BAT, 4, []));
  ships.push(new Ship(ShipType.CRU, 3, []));
  ships.push(new Ship(ShipType.SUB, 3, []));
  ships.push(new Ship(ShipType.DES, 2, []));
  return ships;
}
