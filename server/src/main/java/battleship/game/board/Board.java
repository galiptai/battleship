package battleship.game.board;

import battleship.exceptions.BoardException;
import battleship.game.ship.Ship;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Board {
    private int height;
    private int width;
    private Set<Ship> ships;
    private Tile[][] tiles;

    public Board(int height, int width, Set<Ship> ships, Tile[][] tiles) {
        this.height = height;
        this.width = width;
        this.ships = ships;
        this.tiles = tiles;
    }

    public void addShip(Ship ship, Coordinate startingCoordinate, boolean vertical) {
        if (!ships.contains(ship) && canAddShip(startingCoordinate, vertical, ship.getLength())) {
            ships.add(ship);
            ship.setOccupiedTiles(getTiles(startingCoordinate, vertical, ship.getLength()));
        }
    }

    private boolean canAddShip(Coordinate startingCoordinate, boolean vertical, int length) {
        Tile[] tiles = getTiles(startingCoordinate, vertical, length);
        return Arrays.stream(tiles).allMatch(Tile::isEmpty) && checkTileNeighborsEmpty(tiles, 1);
    }

    private boolean checkTileNeighborsEmpty(Tile[] tiles, int range) {
        Set<Tile> tileSet= new HashSet<>(List.of(tiles));
        for (Tile tile : tiles) {
            int yStart = Math.max(0, tile.getCoordinate().y() - range);
            int yLimit = Math.min(height - 1, tile.getCoordinate().y() + range);
            for (int y = yStart; y < yLimit; y++) {
                int xStart = Math.max(0, tile.getCoordinate().x() - range);
                int xLimit = Math.min(width - 1, tile.getCoordinate().x() + range);
                for (int x = xStart; x < xLimit; x++) {
                    if (!tileSet.contains(tile) && tile.isEmpty()) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private Tile[] getTiles(Coordinate startingCoordinate, boolean vertical, int length) {
        Tile[] tiles = new Tile[length];
        if (vertical) {
            int lowerEnd = startingCoordinate.y() + length - 1;
            if (lowerEnd < height) {
                for (int i = 0; i < length; i++) {
                    tiles[i] = this.tiles[startingCoordinate.y() + i][startingCoordinate.x()];
                }
            } else {
                throw new BoardException("Out of bounds at y by %d".formatted(lowerEnd - height - 1));
            }
        } else {
            int rightEnd = startingCoordinate.x() + length - 1;
            if (rightEnd < width) {
                for (int i = 0; i < length; i++) {
                    tiles[i] = this.tiles[startingCoordinate.y()][startingCoordinate.x() + i];
                }
            } else {
                throw new BoardException("Out of bounds at x by %d".formatted(rightEnd - width - 1));
            }
        }
        return tiles;
    }
}
