import { Board } from "../components/Board";
import { Tile } from "../components/Tile";
import { Ship, ShipType } from "./Ship";

export function createEmptyBoard(height = 10, width = 10): Board {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < 10; x++) {
      row[x] = { coordinate: { y, x }, hit: false, placedShip: null };
    }
    tiles[y] = row;
  }
  const ships: Ship[] = [];
  return {
    player: "Player",
    height,
    width,
    tiles,
    ships,
  };
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

export function checkNeighborsEmpty(board: Board, tiles: Tile[], range = 1): boolean {
  const neighbors: Set<Tile> = new Set();
  for (const tile of tiles) {
    const yStart = Math.max(0, tile.coordinate.y - range);
    const yLimit = Math.min(board.height - 1, tile.coordinate.y + range);
    for (let y = yStart; y <= yLimit; y++) {
      const xStart = Math.max(0, tile.coordinate.x - range);
      const xLimit = Math.min(board.width - 1, tile.coordinate.x + range);
      for (let x = xStart; x <= xLimit; x++) {
        neighbors.add(board.tiles[y][x]);
      }
    }
  }
  for (const tile of tiles) {
    neighbors.delete(tile);
  }
  return [...neighbors].every((tile) => tile.placedShip === null);
}

export function verifyBoard(board: Board): boolean {
  if (board.ships.length !== 5) {
    return false;
  }
  if (new Set(board.ships).size !== 5) {
    return false;
  }
  for (const ship of board.ships) {
    if (!checkNeighborsEmpty(board, ship.tiles)) {
      return false;
    }
  }
  return true;
}
