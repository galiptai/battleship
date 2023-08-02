package battleship.game;

import battleship.game.board.Board;
import battleship.game.ship.Ship;
import lombok.Getter;

import java.util.Set;
import java.util.UUID;

public class Player {
    @Getter
    private UUID id;
    private String name;
    private Set<Ship> ships;
    private Board board;

    public Player(UUID id) {
        this.id = id;
    }

    public boolean isValid() {
        if (name.isEmpty() || name.length() > 30) {
            return false;
        }
        return true;
    }

}
