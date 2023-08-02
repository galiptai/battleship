package battleship.game.ship;

import lombok.Getter;

@Getter
public enum ShipType {
    CARRIER("CAR", 5),
    BATTLESHIP("BAT", 4),
    CRUISER("CRU", 3),
    SUBMARINE("SUB", 3),
    DESTROYER("DES", 2);

    private final String abbreviation;
    private final int length;

    ShipType(String abbreviation, int length) {
        this.abbreviation = abbreviation;
        this.length = length;
    }
}
