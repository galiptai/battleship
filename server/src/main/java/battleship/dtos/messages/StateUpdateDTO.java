package battleship.dtos.messages;

import battleship.game.GameState;
import lombok.NonNull;

public record StateUpdateDTO(@NonNull GameState gameState, String message) {
}
