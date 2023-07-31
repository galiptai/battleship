import { Coordinate } from "../components/gameplay/DrawBoard";
import { Tile } from "../components/gameplay/Tile";
import { ShipPlacement } from "../components/setup/ShipSelector";
import { Ship } from "./Ship";

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

  addShip(startCoordinate: Coordinate, placement: ShipPlacement) {
    if (!this.ships.has(placement.ship) && this.canAddShip(startCoordinate, placement)) {
      placement.ship.setTiles(this.getTiles(startCoordinate, placement));
      this.ships.add(placement.ship);
    }
  }
  getTiles(startCoordinate: Coordinate, placement: ShipPlacement): Tile[] {
    const tiles: Tile[] = [];
    for (let i = 0; i < placement.ship.type.length; i++) {
      const tile: Tile | undefined =
        this.tiles[startCoordinate.y + (placement.vertical ? i : 0)]?.[
          startCoordinate.x + (!placement.vertical ? i : 0)
        ];
      if (tile) {
        tiles.push(tile);
      }
    }
    return tiles;
  }

  canAddShip(startCoordinate: Coordinate, placement: ShipPlacement): boolean {
    const tiles = this.getTiles(startCoordinate, placement);
    return (
      tiles.length === placement.ship.type.length &&
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
}
