package battleship.game.board;

import battleship.game.ship.Ship;

import java.util.Set;

public class Board {
    private int height;
    private int width;

    private Set<Ship> ships;
    private Tile[][] tiles;

    public boolean isValid() {
        return false;
    }
}
