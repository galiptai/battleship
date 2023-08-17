package battleship.game.board;

import battleship.exceptions.IllegalActionException;
import battleship.game.ship.Ship;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class Tile {
    @Getter
    private final Coordinate coordinate;
    @Getter
    private boolean hit;
    @Setter
    private Ship ship;


    public boolean isEmpty() {
        return ship == null;
    }

    public boolean guess() throws IllegalActionException {
        if (hit) {
            throw new IllegalActionException("This tile has already been guessed.");
        }
        hit = true;
        return !isEmpty();
    }
}
