package battleship.service;

import battleship.exceptions.GameNotFoundException;
import battleship.game.Game;
import battleship.game.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
@Slf4j
public class GameProvider {

    private final Map<UUID, Game> games;


    public GameProvider() {
        this.games = new HashMap<>();
    }

    public Game getGame(UUID gameId) throws GameNotFoundException {
        Game game = games.get(gameId);
        if (game == null) {
            throw new GameNotFoundException("Game not found.");
        }
        return game;
    }

    public Optional<Game> getJoinableGame() {
        return games.values().stream().filter(Game::isJoinable).findFirst();
    }

    public UUID startNewGame(Player player) {
        Game game = new Game(player);
        games.put(game.getId(), game);
        log.info("Created GAME-%s for PLAYER-%s".formatted(game.getId(), player.getId()));
        return game.getId();
    }

    public void closeGame(UUID gameId) {
        games.remove(gameId);
        log.info("GAME-%s closed".formatted(gameId));
    }
}
