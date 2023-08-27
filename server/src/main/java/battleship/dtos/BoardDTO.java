package battleship.dtos;

import java.util.List;

public record BoardDTO(String player, int height, int width, List<ShipDTO> ships) {
}
