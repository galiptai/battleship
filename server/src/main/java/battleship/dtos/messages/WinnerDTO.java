package battleship.dtos.messages;

import battleship.game.WhichPlayer;

public record WinnerDTO(WhichPlayer winner) {
}
