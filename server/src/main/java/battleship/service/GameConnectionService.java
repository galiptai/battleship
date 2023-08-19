package battleship.service;

import battleship.dtos.GameDTO;
import battleship.exceptions.IllegalActionException;
import battleship.game.Game;
import battleship.game.Player;
import battleship.game.WhichPlayer;
import battleship.websocket.WebsocketMessenger;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameConnectionService {

    private final WebsocketMessenger websocketMessenger;

    private final GameProvider gameProvider;

    public void findNewGame(@NonNull UUID playerId) {
        UUID gameId;
        Game game = gameProvider.getJoinableGame().orElse(null);
        if (game != null) {
            Player player = new Player(playerId, WhichPlayer.PLAYER2);
            try {
                game.addSecondPlayer(player);
                gameId = game.getId();
            } catch (IllegalActionException exception) {
                log.error(exception.getMessage(), exception);
                return;
            }
        } else {
            Player player = new Player(playerId, WhichPlayer.PLAYER1);
            gameId = gameProvider.startNewGame(player);
        }

        websocketMessenger.sendJoinDataUser(playerId, gameId);
    }

    public void attemptRejoin(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            if (game.hasPlayerWithId(playerId) && game.isRejoinable()) {
                websocketMessenger.sendJoinDataUser(playerId, gameId);
            } else {
                websocketMessenger.sendJoinDataUser(playerId, null);
            }
        } catch (Exception exception) {
            websocketMessenger.sendJoinDataUser(playerId, null);
        }
    }

    public GameDTO getGame(@NonNull UUID gameId, @NonNull UUID playerId) throws IllegalActionException {
        Game game = gameProvider.getGame(gameId);
        Player player = game.getPlayerById(playerId);
        return game.getGame(player);
    }

    public void joinGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            game.connect(player);
            log.info("Player %s joined GAME-%s".formatted(playerId, gameId));
            websocketMessenger.sendStateUpdateGlobal(game);
        } catch (IllegalArgumentException exception) {
            websocketMessenger.sendGameErrorUser(playerId, "Game no longer available.");
        } catch (IllegalActionException exception) {
            websocketMessenger.sendGameErrorUser(playerId, "You are not in this game.");
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    public void leaveGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            player.setConnected(false);
            if (game.isRunning()) {
                log.info("Player %s left GAME-%s".formatted(playerId, gameId));
                if (game.anyConnected()) {
                    game.suspend();
                    websocketMessenger.sendStateUpdateGlobal(game);
                } else {
                    gameProvider.closeGame(gameId);
                }
            } else {
                forfeitGame(gameId, playerId);
                if (game.anyConnected()) {
                    websocketMessenger.sendStateUpdateGlobal(game);
                } else {
                    gameProvider.closeGame(gameId);
                }
            }
        } catch (IllegalArgumentException | IllegalActionException ignore) {
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    public void forfeitGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            game.forfeitGame(player);
            log.info("Player %s forfeited GAME-%s".formatted(playerId, gameId));
        } catch (IllegalArgumentException exception) {
            websocketMessenger.sendGameErrorUser(playerId, "Game no longer available.");
        } catch (IllegalActionException exception) {
            websocketMessenger.sendGameErrorUser(playerId, "You are not in this game.");
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }
}
