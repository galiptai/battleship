package battleship.dtos.gameupdates;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public abstract class GameUpdateDTO {

    private final GameUpdateType type;
}
