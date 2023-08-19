package battleship.dtos;

import battleship.dtos.messages.game.GuessDTO;
import battleship.game.GameState;
import battleship.game.WhichPlayer;

import java.util.List;
import java.util.UUID;

public record GameDTO(UUID id, WhichPlayer whichPlayer, BoardDTO player, BoardDTO opponent, List<GuessDTO> guesses, GameState gameState) {
}
