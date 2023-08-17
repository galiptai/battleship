package battleship.utilities;

import battleship.dtos.BoardDTO;
import battleship.dtos.ShipDTO;
import battleship.exceptions.BoardException;
import battleship.game.board.Board;
import battleship.game.board.Coordinate;
import battleship.game.board.Tile;
import battleship.game.ship.Ship;

import java.util.HashSet;
public class DataConverter {

    public static Board convertAndVerifyBoard(BoardDTO boardData) throws BoardException {
        Tile[][] tiles = new Tile[boardData.height()][boardData.width()];
        for (int y = 0; y < boardData.height(); y++) {
            for (int x = 0; x < boardData.width(); x++) {
                tiles[y][x] = new Tile(new Coordinate(y, x), false, null);
            }
        }
        Board board = new Board(boardData.height(), boardData.width(), new HashSet<>(), tiles);
        for (ShipDTO ship : boardData.ships()) {
            board.addShip(new Ship(ship.type(), ship.vertical(), null), ship.startingCoordinate(), ship.vertical());
        }
        return board;
    }
}
