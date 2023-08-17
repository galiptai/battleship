package battleship.game.ship;

import lombok.Getter;

@Getter
public enum ShipType {
    CARRIER("Carrier", 5),
    BATTLESHIP("Battleship", 4),
    CRUISER("Cruiser", 3),
    SUBMARINE("Submarine", 3),
    DESTROYER("Destroyer", 2);

    private final String name;
    private final int length;

    ShipType(String name, int length) {
        this.name = name;
        this.length = length;
    }
}
