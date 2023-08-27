package battleship.game.board;

import battleship.exceptions.InvalidActionException;
import battleship.game.ship.Ship;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
public class Tile {
    private final Coordinate coordinate;
    private boolean guessed;
    @Setter
    private Ship ship;


    public boolean isEmpty() {
        return ship == null;
    }

    public Ship guess() throws InvalidActionException {
        if (guessed) {
            throw new InvalidActionException("This tile has already been guessed.");
        }
        guessed = true;
        return ship;
    }
}
