package battleship.dtos;

import battleship.game.board.Coordinate;
import battleship.game.ship.Ship;
import battleship.game.ship.ShipType;

public record ShipDTO(ShipType type, Coordinate startingCoordinate, boolean vertical) {

    public ShipDTO(Ship ship) {
        this(ship.getType(), ship.getOccupiedTiles()[0].getCoordinate(), ship.isVertical());
    }
}
