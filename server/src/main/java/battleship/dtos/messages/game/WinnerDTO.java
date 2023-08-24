package battleship.dtos.messages.game;

import battleship.game.WhichPlayer;
import lombok.NonNull;

public record WinnerDTO(@NonNull WhichPlayer winner, String message) {
}
