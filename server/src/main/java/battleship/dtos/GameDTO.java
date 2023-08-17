package battleship.dtos;

import battleship.game.GameState;

import java.util.List;
import java.util.UUID;

public record GameDTO(UUID id, BoardDTO player, BoardDTO opponent, List<GuessDTO> guesses, GameState gameState) {
}
