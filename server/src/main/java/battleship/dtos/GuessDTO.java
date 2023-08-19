package battleship.dtos;

import battleship.game.Guess;
import battleship.game.WhichPlayer;
import battleship.game.board.Coordinate;

public record GuessDTO(WhichPlayer whichPlayer, Coordinate coordinate, boolean hit) {

    public GuessDTO(Guess guess) {
        this(guess.getPlayer().getWhichPlayer(), guess.getCoordinate(), guess.isHit());
    }
}
