package battleship.game;

import battleship.dtos.BoardDTO;
import battleship.dtos.GameDTO;
import battleship.dtos.messages.game.GuessDTO;
import battleship.exceptions.IllegalActionException;
import battleship.game.board.Coordinate;
import battleship.game.ship.Ship;
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
    private WhichPlayer currentTurn;
    private final List<Guess> guesses;
    @Getter
    private GameState state;
    private WhichPlayer winner;

    public Game(Player player1) {
        this.id = UUID.randomUUID();
        this.player1 = player1;
        this.player2 = null;
        this.currentTurn = null;
        this.guesses = new ArrayList<>();
        this.state = GameState.JOINING;
        this.winner = null;
    }

    public GameDTO getGame(Player player) throws IllegalActionException {
        BoardDTO playerData = player.getPlayerDataFull();
        Player opponent = getOpponent(player);
        BoardDTO opponentData = opponent != null ? opponent.getPlayerDataRevealed() : null;
        return new GameDTO(
                id,
                player.getWhichPlayer(),
                playerData,
                opponentData,
                guesses.stream().map(GuessDTO::new).toList(),
                state,
                winner
        );
    }

    public void addSecondPlayer(@NonNull Player player) throws IllegalActionException {
        if (isJoinable()) {
            if (player1.getId().equals(player.getId())) {
                throw new IllegalArgumentException("Player is already in the game");
            }
            player2 = player;
            state = GameState.SETUP;
            return;
        }
        throw new IllegalActionException("This is not joinable.");
    }

    public void connect(Player player) {
        player.setConnected(true);
        if (allConnected()) {
            if (state == GameState.JOINING) {
                state = GameState.SETUP;
            } else if (state == GameState.SUSPENDED) {
                if (currentTurn == WhichPlayer.PLAYER1) {
                    state = GameState.P1_TURN;
                } else if (currentTurn == WhichPlayer.PLAYER2) {
                    state = GameState.P2_TURN;
                }
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
        currentTurn = WhichPlayer.PLAYER1;
        state = GameState.P1_TURN;
    }

    public boolean isJoinable() {
        return player2 == null;
    }

    public boolean isRejoinable() {
        return state == GameState.SUSPENDED;
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

    public boolean hasStarted() {
        return isRunning() || state == GameState.SUSPENDED;
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
            throw new IllegalActionException("Player is not in this game.");
        }
    }

    public void forfeitGame(Player forfeitingPlayer) throws IllegalActionException {
        state = GameState.OVER;
        if (forfeitingPlayer == player1) {
            winner = player2.getWhichPlayer();
        } else if (forfeitingPlayer == player2) {
            winner = player1.getWhichPlayer();
        } else {
            throw new IllegalActionException("Player is not in this game.");
        }
    }

    public Guess makeGuess(Player player, Coordinate coordinate) throws IllegalActionException {
        if (!isPlayersTurn(player)) {
            throw new IllegalActionException("It's not your turn.");
        }
        Player opponent = getOpponent(player);
        Ship ship = opponent.submitGuess(coordinate);
        Guess guess;
        if (ship != null) {
            guess = new Guess(player.getWhichPlayer(), coordinate, true, ship.isSank());
        } else {
            guess = new Guess(player.getWhichPlayer(), coordinate, false, false);
        }
        guesses.add(guess);
        if (!checkWin(player, opponent)) {
            changeTurn();
        }
        return guess;
    }

    public Player getOpponent(@NonNull Player player) throws IllegalActionException {
        if (player1.equals(player)) {
            return player2;
        } else if (player2.equals(player)) {
            return player1;
        } else {
            throw new IllegalActionException("Player is not in this game.");
        }
    }

    private boolean isPlayersTurn(Player player) {
        return isRunning() && currentTurn == player.getWhichPlayer();
    }

    private boolean checkWin(Player player, Player opponent) {
        if (opponent.allShipsSank()) {
            state = GameState.OVER;
            winner = player.getWhichPlayer();
            return true;
        } else {
            return false;
        }
    }

    private void changeTurn() {
        if (currentTurn == WhichPlayer.PLAYER1) {
            currentTurn = WhichPlayer.PLAYER2;
            if (isRunning()) {
                state = GameState.P2_TURN;
            }
        } else {
            currentTurn = WhichPlayer.PLAYER1;
            if (isRunning()) {
                state = GameState.P1_TURN;
            }
        }
    }

    public Ship getShip(Player opponent, Coordinate coordinate) {
        return opponent.getShip(coordinate);
    }

    public boolean isWon() {
        return winner != null;
    }

    public WhichPlayer getWinner() {
        if (isWon()) {
            return winner;
        } else {
            throw new RuntimeException("The game is not won.");
        }
    }
}
