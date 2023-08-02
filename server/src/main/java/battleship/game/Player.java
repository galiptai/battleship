package battleship.game;

import battleship.game.board.Board;
import battleship.game.ship.Ship;

import java.util.Set;

public class Player {
    private String name;
    private Set<Ship> ships;
    private Board board;

    public boolean isValid() {
        if (name.isEmpty() || name.length() > 30) {
            return false;
        }

        return true;
    }
}
