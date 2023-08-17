package battleship.dtos;

import java.util.UUID;

public record PlayerDTO(UUID id, BoardDTO board) {
}
