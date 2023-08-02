package battleship.game;

import lombok.Getter;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Game {
    @Getter
    private final UUID id;
    private final Player player1;
    private Player player2;
    private final List<Guess> guesses;
    private GameState state;

    public Game(Player player1) {
        this.id = UUID.randomUUID();
        this.player1 = player1;
        this.guesses = new ArrayList<>();
        this.state = GameState.JOINING;
        System.out.println(id.toString());
    }

    public boolean addSecondPlayer(@NonNull Player player) {
        if (state == GameState.JOINING) {
            if (player1.getId().equals(player.getId())) {
                throw new IllegalArgumentException("Player is already in the game");
            }
            player2 = player;
            state = GameState.SETUP;
            return true;
        }
        return false;
    }
    public Player getPlayerById(UUID id) {
        if (player1.getId().equals(id)) {
            return player1;
        } else if(player2.getId().equals(id)) {
            return player2;
        } else {
            throw new IllegalArgumentException("Player is not in this match");
        }
    }

    private Player getPlayer(@NonNull PlayerType playerType) {
        if (playerType == PlayerType.PLAYER_1) {
            return player1;
        } else {
            return player2;
        }
    }
}
