package battleship.game;

import battleship.game.board.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Guess {
    private final WhichPlayer player;
    private final Coordinate coordinate;
    private final boolean hit;
    private final boolean sunk;
}
