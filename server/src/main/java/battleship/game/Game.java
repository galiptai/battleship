package battleship.game;

import battleship.dtos.BoardDTO;
import battleship.dtos.GameDTO;
import battleship.dtos.GuessDTO;
import battleship.exceptions.IllegalActionException;
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
    @Getter
    private GameState state;
    private Player winner;

    public Game(Player player1) {
        this.id = UUID.randomUUID();
        this.player1 = player1;
        this.guesses = new ArrayList<>();
        this.state = GameState.JOINING;
    }

    public GameDTO getGame(Player player) throws IllegalActionException {
        BoardDTO playerData = player.getPlayerDataFull();
        Player opponent = getOpponent(player);
        BoardDTO opponentData = opponent != null ? opponent.getPlayerDataRevealed() : null;
        return new GameDTO(
                id,
                player.equals(player1),
                playerData,
                opponentData,
                guesses.stream().map(GuessDTO::new).toList(),
                state
        );
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

    public void connect(Player player) {
        player.setConnected(true);
        if (allConnected()) {
            if (state == GameState.JOINING) {
                state = GameState.SETUP;
            }
        }
    }

    public void suspend() {
        state = GameState.SUSPENDED;
    }

    public void start() throws IllegalActionException {
        if (state != GameState.SETUP) {
            throw new IllegalActionException("Game is not in a startable state.");
        }
        if (!isGameReady()) {
            throw new IllegalActionException("Start conditions are not met.");
        }
        state = GameState.P1_TURN;
    }

    public boolean allConnected() {
        return player2 != null && player1.isConnected() && player2.isConnected();
    }

    public boolean anyConnected() {
        if (player2 == null) {
            return player1.isConnected();
        } else {
            return player1.isConnected() || player2.isConnected();
        }
    }

    public boolean isGameReady() {
        return allConnected() && player1.isGameReady() && player2.isGameReady();
    }

    public boolean isRunning() {
        return state == GameState.P1_TURN || state == GameState.P2_TURN;
    }

    public boolean hasPlayerWithId(UUID id) {
        return player1.getId().equals(id) || player2.getId().equals(id);
    }

    public Player getPlayerById(UUID id) throws IllegalActionException {
        if (player1.getId().equals(id)) {
            return player1;
        } else if (player2.getId().equals(id)) {
            return player2;
        } else {
            throw new IllegalActionException("Player is not in this match");
        }
    }

    public void forfeitGame(Player forfeitingPlayer) {
        state = GameState.OVER;
        if (forfeitingPlayer == player1) {
            winner = player2;
        } else {
            winner = player1;
        }

    }

    public Player getOpponent(@NonNull Player player) throws IllegalActionException {
        if (player1.equals(player)) {
            return player2;
        } else if (player2.equals(player)) {
            return player1;
        } else {
            throw new IllegalActionException("Player is not in this match");
        }
    }
}
