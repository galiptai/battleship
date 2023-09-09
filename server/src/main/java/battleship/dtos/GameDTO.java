package battleship.dtos;

import battleship.dtos.messages.GuessDTO;
import battleship.game.GameState;
import battleship.game.WhichPlayer;
import lombok.NonNull;

import java.util.List;
import java.util.UUID;

public record GameDTO(@NonNull UUID id,@NonNull WhichPlayer playerIs, boolean privateGame, BoardDTO player1, BoardDTO player2, List<GuessDTO> guesses, @NonNull GameState gameState, WhichPlayer winner) {
}
