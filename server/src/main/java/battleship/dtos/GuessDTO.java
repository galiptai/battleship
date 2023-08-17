package battleship.dtos;

import battleship.game.Guess;
import battleship.game.board.Coordinate;

import java.util.UUID;

public record GuessDTO(UUID playerId, Coordinate coordinate, boolean hit) {

    public GuessDTO(Guess guess) {
        this(guess.getPlayer().getId(), guess.getCoordinate(), guess.isHit());
    }
}
