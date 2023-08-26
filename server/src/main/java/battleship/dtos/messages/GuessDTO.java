package battleship.dtos.messages;

import battleship.game.Guess;
import battleship.game.WhichPlayer;
import battleship.game.board.Coordinate;

public record GuessDTO(WhichPlayer player, Coordinate coordinate, boolean hit) {

    public GuessDTO(Guess guess) {
        this(guess.getPlayer(), guess.getCoordinate(), guess.isHit());
    }
}
