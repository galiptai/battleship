package battleship.game.ship;

import battleship.exceptions.BoardException;
import battleship.game.board.Tile;
import lombok.AllArgsConstructor;

import java.util.Arrays;

@AllArgsConstructor
public class Ship {
    private ShipType type;
    private Tile[] occupiedTiles;

    public int getLength() {
        return type.getLength();
    }

    public void setOccupiedTiles(Tile[] tiles) throws BoardException {
        if (tiles.length != type.getLength() || Arrays.stream(tiles).anyMatch(tile -> !tile.isEmpty())) {
            throw new BoardException("Ship can't be placed here");
        } else {
            occupiedTiles = tiles;
            Arrays.stream(tiles).forEach(tile -> tile.setShip(this));
        }
    }
    

}
