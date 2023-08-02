package battleship.game;

import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;

public class Game {
    private Player player1;
    private Player player2;
    private final List<Guess> guesses;
    private GameState state;

    public Game() {
        this.guesses = new ArrayList<>();
    }

    public boolean isRunning() {
        return state != GameState.OVER;
    }

    public boolean addPlayer(@NonNull Player player,@NonNull PlayerType playerType) {
        Player playerSlot = getPlayer(playerType);
        if (playerSlot != null || player.isValid()) {
            return false;
        }
        return setPlayer(player, playerType);
    }

    private Player getPlayer(@NonNull PlayerType playerType) {
        if (playerType == PlayerType.PLAYER_1) {
            return player1;
        } else {
            return player2;
        }
    }

    private boolean setPlayer(@NonNull Player player, @NonNull PlayerType playerType) {
        if (playerType == PlayerType.PLAYER_1 && player != player2) {
            this.player1 = player;
            return true;
        } else if (player != player1){
            this.player2 = player;
            return true;
        }
        return false;
    }
}
