package battleship.game;

import battleship.dtos.BoardDTO;
import battleship.exceptions.InvalidActionException;
import battleship.exceptions.InvalidRequestException;
import battleship.game.board.Board;
import battleship.game.board.Coordinate;
import battleship.game.ship.Ship;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

public class Player {
    @Getter
    private final UUID id;
    @Getter
    private String name;
    @Getter
    private final WhichPlayer whichPlayer;
    @Getter
    @Setter
    private boolean connected;
    private Board board;

    public Player(UUID id, WhichPlayer whichPlayer) {
        this.id = id;
        this.name = null;
        this.whichPlayer = whichPlayer;
        this.connected = false;
        this.board = null;
    }

    public BoardDTO getPlayerDataFull() {
        if (isSet()) {
            return board.getBoardDataFull(name);
        } else {
            return null;
        }
    }

    public BoardDTO getPlayerDataRevealed() {
        if (isSet()) {
            return  board.getBoardDataRevealed(name);
        } else {
            return null;
        }
    }

    public boolean isGameReady() {
        return connected && isSet();
    }

    public boolean isSet() { return  name!= null && board != null;}

    public void setData(String name, Board board) throws InvalidActionException, InvalidRequestException {
        if (this.name == null && this.board == null) {
            if (name.isEmpty()) {
                throw new InvalidRequestException("Name can't be empty.");
            } else if (name.length() > 30) {
                throw new InvalidRequestException("Name is too long.");
            } else {
                this.name = name;
                this.board = board;
            }
        } else {
            throw new InvalidActionException("Your board has already been set.");
        }
    }

    public Ship submitGuess(Coordinate coordinate) throws InvalidActionException {
        return board.submitGuess(coordinate);
    }

    public Ship getShip(Coordinate coordinate) {
        return board.getShip(coordinate);
    }

    public boolean allShipsSank() {
        return board.allShipSank();
    }
}
