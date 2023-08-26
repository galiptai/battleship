package battleship.dtos.messages;

import battleship.dtos.ShipDTO;
import battleship.game.Guess;
import battleship.game.ship.Ship;

public record GuessSunkDTO(GuessDTO guess, ShipDTO ship) {

    public GuessSunkDTO(Guess guess, Ship ship) {
        this(new GuessDTO(guess), new ShipDTO(ship));
    }
}
