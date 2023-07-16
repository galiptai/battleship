import { Board } from "../components/Board";
import { Tile } from "../components/Tile";
import { Ship, ShipType } from "./Ship";

export function createEmptyBoard(height = 10, width = 10): Board {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < 10; x++) {
      row[x] = { x, y, hit: false, placedShip: null };
    }
    tiles[y] = row;
  }
  const ships: Ship[] = [];
  return {
    height,
    width,
    tiles,
    ships,
  };
}

export function getShips(): Ship[] {
  const ships: Ship[] = [];
  ships.push(new Ship(ShipType.CAR, 5, []));
  return ships;
}
