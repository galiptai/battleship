package battleship.dtos.messages.game;

import battleship.game.GameState;

public record StateUpdateDTO(GameState gameState) {
}
