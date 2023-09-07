package battleship.game;

import battleship.dtos.BoardDTO;
import battleship.dtos.GameDTO;
import battleship.dtos.messages.GuessDTO;
import battleship.exceptions.GameStateException;
import battleship.exceptions.IllegalRequestException;
import battleship.exceptions.InvalidActionException;
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
    private final boolean privateGame;
    private WhichPlayer currentTurn;
    private final List<Guess> guesses;
    @Getter
    private GameState state;
    private WhichPlayer winner;

    public Game(boolean privateGame, Player player1) {
        this.id = UUID.randomUUID();
        this.privateGame = privateGame;
        this.player1 = player1;
        this.player2 = null;
        this.currentTurn = null;
        this.guesses = new ArrayList<>();
        this.state = GameState.JOINING;
        this.winner = null;
    }

    public GameDTO getGame(Player player) {
        BoardDTO playerData = player.getPlayerDataFull();
        Player opponent = getOpponent(player);
        BoardDTO opponentData = opponent != null ? opponent.getPlayerDataRevealed() : null;
        return new GameDTO(
                id,
                player.getWhichPlayer(),
                privateGame,
                playerData,
                opponentData,
                guesses.stream().map(GuessDTO::new).toList(),
                state,
                winner
        );
    }

    public Player getPlayerById(UUID id) throws IllegalRequestException {
        if (player1.getId().equals(id)) {
            return player1;
        } else if (player2.getId().equals(id)) {
            return player2;
        } else {
            throw new IllegalRequestException("Player is not in this game.");
        }
    }

    public Player getOpponent(@NonNull Player player) {
        if (player1.equals(player)) {
            return player2;
        } else if (player2.equals(player)) {
            return player1;
        } else {
            throw new IllegalArgumentException("Player is not in this game.");
        }
    }

    public Ship getShip(Player opponent, Coordinate coordinate) {
        return opponent.getShip(coordinate);
    }

    public WhichPlayer getWinner() throws GameStateException {
        if (isWon()) {
            return winner;
        } else {
            throw new GameStateException("The game is not won.");
        }
    }

    public void addSecondPlayer(@NonNull Player player) throws GameStateException {
        if (isJoinable()) {
            if (player1.getId().equals(player.getId())) {
                throw new GameStateException("Player is trying to join game they are already in.");
            }
            player2 = player;
            state = GameState.SETUP;
            return;
        }
        throw new GameStateException("This game is not joinable.");
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

    public void disconnect(Player player) {
        player.setConnected(false);
        if (isRunning()) {
            state = GameState.SUSPENDED;
        } else {
            state = GameState.OVER;
        }
    }

    public void start() throws GameStateException {
        if (state != GameState.SETUP) {
            throw new GameStateException("Game is not in a startable state.");
        }
        if (!isGameReady()) {
            throw new GameStateException("Start conditions are not met.");
        }
        currentTurn = WhichPlayer.PLAYER1;
        state = GameState.P1_TURN;
    }

    public void forfeitGame(Player forfeitingPlayer) throws InvalidActionException {
        if (state == GameState.OVER) {
            throw new InvalidActionException("Can't forfeit a game that's already over.");
        }
        boolean notStarted = !hasStarted();
        state = GameState.OVER;
        if (notStarted) {
            return;
        }
        if (forfeitingPlayer == player1) {
            winner = player2.getWhichPlayer();
        } else {
            winner = player1.getWhichPlayer();
        }
    }

    public Guess makeGuess(Player player, Coordinate coordinate) throws InvalidActionException {
        if (!isPlayersTurn(player)) {
            throw new InvalidActionException("It's not your turn.");
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
        if (!checkWin()) {
            changeTurn();
        }
        return guess;
    }

    public boolean isPrivate() {
        return privateGame;
    }

    public boolean isJoinable() {
        return player2 == null && state == GameState.JOINING;
    }

    public boolean allConnected() {
        return player2 != null && player1.isConnected() && player2.isConnected();
    }

    public boolean anyConnected() { return player1.isConnected() || (player2 != null && player2.isConnected()); }

    public boolean isGameReady() {
        return allConnected() && player1.isGameReady() && player2.isGameReady();
    }

    public boolean isRunning() {
        return state == GameState.P1_TURN || state == GameState.P2_TURN;
    }

    public boolean hasStarted() {
        return state != GameState.JOINING && state != GameState.SETUP;
    }

    public boolean isOver() {
        return state == GameState.OVER;
    }

    public boolean isWon() {
        return winner != null;
    }

    public boolean hasPlayerWithId(UUID id) {
        return player1.getId().equals(id) || (player2 != null && player2.getId().equals(id));
    }

    private boolean isPlayersTurn(Player player) {
        return isRunning() && currentTurn == player.getWhichPlayer();
    }

    private boolean checkWin() {
        if (player1.allShipsSank()) {
            state = GameState.OVER;
            winner = WhichPlayer.PLAYER2;
            return true;
        } else if (player2.allShipsSank()) {
            state = GameState.OVER;
            winner = WhichPlayer.PLAYER1;
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

}
