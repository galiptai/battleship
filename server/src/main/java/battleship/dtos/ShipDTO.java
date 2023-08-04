package battleship.dtos;

import battleship.game.board.Coordinate;
import battleship.game.ship.ShipType;

public record ShipDTO(ShipType type, Coordinate startingCoordinate, boolean vertical) {
}
