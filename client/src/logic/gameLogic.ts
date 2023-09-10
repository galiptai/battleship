import { Coordinate } from "../components/gameplay/DrawBoard";
import { Tile } from "../components/gameplay/Tile";
import { Board } from "./Board";
import { WhichPlayer } from "./OnlineGame";
import { SHIP_TYPES, Ship } from "./Ship";
import { Dimensions } from "./renderFunctions";

export type Guess = {
  coordinate: Coordinate;
  hit: boolean;
  player: WhichPlayer;
};

export function createEmptyBoard(dimensions: Dimensions, startername = "Player"): Board {
  const tiles: Tile[][] = [];
  for (let y = 0; y < dimensions.height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < dimensions.width; x++) {
      row[x] = { coordinate: { y, x }, guessed: false, placedShip: null };
    }
    tiles[y] = row;
  }
  const ships: Set<Ship> = new Set();
  return new Board(startername, dimensions.height, dimensions.width, ships, tiles);
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
