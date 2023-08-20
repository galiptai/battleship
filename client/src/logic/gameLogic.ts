import { Coordinate } from "../components/gameplay/DrawBoard";
import { Tile } from "../components/gameplay/Tile";
import { WhichPlayer } from "../components/online/OnlineGame";
import { Board } from "./Board";
import { SHIP_TYPES, Ship } from "./Ship";

export type Guess = {
  coordinate: Coordinate;
  hit: boolean;
  player: WhichPlayer;
};

export function createEmptyBoard(height = 10, width = 10, name = "Player"): Board {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row[x] = { coordinate: { y, x }, guessed: false, placedShip: null };
    }
    tiles[y] = row;
  }
  const ships: Set<Ship> = new Set();
  return new Board(name, height, width, ships, tiles);
}

export function getShips(): Ship[] {
  const ships: Ship[] = [];
  ships.push(new Ship(SHIP_TYPES.CARRIER, []));
  ships.push(new Ship(SHIP_TYPES.BATTLESHIP, []));
  ships.push(new Ship(SHIP_TYPES.CRUISER, []));
  ships.push(new Ship(SHIP_TYPES.SUBMARINE, []));
  ships.push(new Ship(SHIP_TYPES.DESTROYER, []));
  return ships;
}
