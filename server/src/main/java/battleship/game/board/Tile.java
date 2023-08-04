package battleship.game.board;

import battleship.game.ship.Ship;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class Tile {
    @Getter
    private Coordinate coordinate;
    private boolean hit;
    @Setter
    private Ship ship;


    public boolean isEmpty() {
        return ship == null;
    }
}
