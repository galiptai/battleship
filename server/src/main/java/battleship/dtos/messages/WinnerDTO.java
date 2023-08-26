package battleship.dtos.messages;

import battleship.game.WhichPlayer;
import lombok.NonNull;

public record WinnerDTO(@NonNull WhichPlayer winner, String message) {
}
