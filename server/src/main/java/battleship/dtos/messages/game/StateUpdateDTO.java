package battleship.dtos.messages.game;

import battleship.game.GameState;
import lombok.NonNull;

public record StateUpdateDTO(@NonNull GameState gameState, String message) {
}
