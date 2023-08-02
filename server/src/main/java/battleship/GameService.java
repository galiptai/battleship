package battleship;

import battleship.game.Game;
import battleship.game.Player;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {

    private final Map<UUID, Game> games;

    public GameService() {
        games = new HashMap<>();
    }

    public UUID findNewGame(@NonNull UUID playerId) {
        Player player = new Player(playerId);
        for (Game game : games.values()) {
            if (game.addSecondPlayer(player)) {
                return game.getId();
            }
        }

        Game newGame = new Game(player);
        games.put(newGame.getId(), newGame);
        return newGame.getId();
    }

    public boolean gameRejoinable(@NonNull UUID playerID, @NonNull UUID gameId) {
        return games.get(gameId) != null;
    }
}
