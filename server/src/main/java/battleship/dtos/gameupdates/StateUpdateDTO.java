package battleship.dtos.gameupdates;

import battleship.game.GameState;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StateUpdateDTO extends GameUpdateDTO{

    private static final GameUpdateType type = GameUpdateType.STATE_CHANGE;

    private GameState gameState;

    public StateUpdateDTO(GameState gameState) {
        super(type);
        this.gameState = gameState;
    }
}
