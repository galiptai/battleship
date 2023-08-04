package battleship.dtos;

import battleship.game.board.Board;
import battleship.game.board.Coordinate;
import battleship.game.board.Tile;
import battleship.game.ship.Ship;

import java.util.HashSet;
import java.util.List;

public record BoardDTO(String player, int height, int width, List<ShipDTO> ships) {

    public Board getBoard() {
        Tile[][] tiles = new Tile[height][width];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                tiles[y][x] = new Tile(new Coordinate(y, x), false, null);
            }
        }
        Board board = new Board(height, width, new HashSet<>(), tiles);
        ships.forEach(shipDTO -> board.addShip(new Ship(shipDTO.type(), null), shipDTO.startingCoordinate(),
                shipDTO.vertical()));
        return board;
    }
}
