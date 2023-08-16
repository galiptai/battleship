package battleship.game;

import battleship.dtos.BoardDTO;
import battleship.game.board.Board;
import battleship.websocket.WebsocketMessenger;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class GameManager {

    private final Map<UUID, Game> games;
    private final WebsocketMessenger websocketMessenger;

    @Autowired
    public GameManager(WebsocketMessenger websocketMessenger) {
        this.games = new HashMap<>();
        this.websocketMessenger = websocketMessenger;
    }

    public void findNewGame(@NonNull UUID playerId) {
        Player player = new Player(playerId);
        UUID gameId = null;
        for (Game game : games.values()) {
            if (game.addSecondPlayer(player)) {
                gameId = game.getId();
                break;
            }
        }
        if (gameId == null) {
            gameId = startNewGame(player);
        }

        websocketMessenger.sendJoinDataUser(playerId, gameId);
    }

    public void attemptRejoin(@NonNull UUID gameId, @NonNull UUID playerId) {
        Game game = games.get(gameId);
        if (game != null && game.hasPlayerWithId(playerId)) {
            websocketMessenger.sendJoinDataUser(playerId, gameId);
        } else {
            websocketMessenger.sendJoinDataUser(playerId, null);
        }
    }

    public void joinGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerId);
        game.connect(player);
        log.info("Player %s joined GAME-%s".formatted(playerId, gameId));
        websocketMessenger.sendGameDataUser(playerId, game);
        websocketMessenger.sendStateUpdateGlobal(game);
    }

    public void leaveGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerId);
        player.setConnected(false);
        log.info("Player %s left GAME-%s".formatted(playerId, gameId));
        if (!game.anyConnected()) {
            closeGame(gameId);
        }
    }

    public void forfeitGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerId);
        game.forfeitGame(player);
        log.info("Player %s left GAME-%s".formatted(playerId, gameId));
        closeGame(gameId);
    }

    public Boolean setBoard(@NonNull UUID gameId, @NonNull UUID playerId, @NonNull BoardDTO boardData) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerId);
        Board board = boardData.getBoard();
        if (player.setData(boardData.player(), board)) {
            if (game.isGameReady()) {
                System.out.println("ready");
            }
            return true;
        }
        return false;
    }

    private Game getGame(UUID gameId) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        return game;
    }

    private UUID startNewGame(Player player) {
        Game game = new Game(player);
        games.put(game.getId(), game);
        log.info("Created GAME-%s for PLAYER-%s".formatted(game.getId(), player.getId()));
        return game.getId();
    }

    private void closeGame(UUID gameId) {
        games.remove(gameId);
        log.info("GAME-%s closed".formatted(gameId));
    }

}
