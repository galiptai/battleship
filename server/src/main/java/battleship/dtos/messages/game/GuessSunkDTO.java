package battleship.dtos.messages.game;

import battleship.dtos.ShipDTO;
import battleship.game.Guess;
import battleship.game.ship.Ship;

public record GuessSunkDTO(GuessDTO guessDTO, ShipDTO shipDTO) {

    public GuessSunkDTO(Guess guess, Ship ship) {
        this(new GuessDTO(guess), new ShipDTO(ship));
    }
}
