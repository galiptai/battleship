package battleship.game;

import battleship.game.board.Board;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

public class Player {
    @Getter
    private final UUID id;
    private String name;
    @Getter
    @Setter
    private boolean connected;
    private Board board;

    public Player(UUID id) {
        this.id = id;
    }

    public boolean isGameReady() {
        return connected && name != null && board != null;
    }

    public boolean setData(String name, Board board) {
        if (this.name == null && this.board == null) {
            if ((!name.isEmpty() && name.length() < 30)) {
                this.name = name;
                this.board = board;
                return true;
            }
        }
        return false;
    }

}
