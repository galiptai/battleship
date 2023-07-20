import { Board } from "../components/gameplay/Board";
import { Tile } from "../components/gameplay/Tile";
import { Ship, ShipType } from "./Ship";

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
  return {
    player: name,
    height,
    width,
    tiles,
    ships,
  };
}

export function getShips(): Ship[] {
  const ships: Ship[] = [];
  // ships.push(new Ship(ShipType.CAR, 5, []));
  // ships.push(new Ship(ShipType.BAT, 4, []));
  // ships.push(new Ship(ShipType.CRU, 3, []));
  // ships.push(new Ship(ShipType.SUB, 3, []));
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
  if (board.player === "") {
    return false;
  }
  if (board.ships.size !== 1) {
    return false;
  }
  for (const ship of board.ships) {
    if (!checkNeighborsEmpty(board, ship.tiles)) {
      return false;
    }
  }
  return true;
}

export function convertCoordinateToLetter(coordinate: number): string {
  if (coordinate < 0 || coordinate > 25) {
    throw new Error("Coordinate can't be converted to letter");
  }
  const ASCIIShift = 65;
  return String.fromCharCode(coordinate + ASCIIShift);
}

export function createLetterArray(width: number): string[] {
  if (width > 26) {
    throw new Error("Max board width exceeded");
  }
  const letters: string[] = [];
  for (let i = 0; i < width; i++) {
    letters.push(convertCoordinateToLetter(i));
  }
  letters.unshift("");
  return letters;
}

export function checkAllBoatsSank(board: Board): boolean {
  console.log("boo");
  return [...board.ships].every((ship) => ship.isSank());
}
