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

    public void setOccupiedTiles(Tile[] tiles) {
        if (tiles.length != type.getLength() || Arrays.stream(tiles).anyMatch(tile -> !tile.isEmpty())) {
            occupiedTiles = tiles;
            Arrays.stream(tiles).forEach(tile -> tile.setShip(this));
        } else {
            throw new BoardException("Ship can't be placed here");
        }
    }
    

}
