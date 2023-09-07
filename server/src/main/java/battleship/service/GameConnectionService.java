package battleship.service;

import battleship.dtos.GameDTO;
import battleship.dtos.messages.ErrorDTO;
import battleship.dtos.messages.ErrorType;
import battleship.exceptions.GameNotFoundException;
import battleship.exceptions.GameStateException;
import battleship.exceptions.IllegalRequestException;
import battleship.game.Game;
import battleship.game.Player;
import battleship.game.WhichPlayer;
import battleship.websocket.WebsocketMessenger;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameConnectionService {

    private final WebsocketMessenger websocketMessenger;

    private final GameProvider gameProvider;

    public void findRejoinableGame(UUID playerId) {
        Optional<Game> gamePlayerIsIn = gameProvider.getGamePlayerIsIn(playerId);
        if (gamePlayerIsIn.isPresent()) {
            Game game = gamePlayerIsIn.get();
            websocketMessenger.sendJoinDataUser(playerId, game.getId(), true);
        } else {
            websocketMessenger.sendJoinDataUser(playerId, null, true);
        }
    }

    public void findNewGame(@NonNull UUID playerId) {
        if (addToGame(playerId)) {
            return;
        }
        startNewGame(false, playerId);
    }

    public void findSpecificGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            game.addSecondPlayer(new Player(playerId, WhichPlayer.PLAYER2));
            websocketMessenger.sendJoinDataUser(playerId, gameId, false);
        } catch (GameNotFoundException exception) {
            websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.WARNING, 400,
                    "No game found with this ID.", exception.getMessage()));
        } catch (GameStateException exception) {
            websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.ERROR, 400,
                    "You can't join this game.", exception.getMessage()));
        }
    }

    private boolean addToGame(UUID playerId) {
        Optional<Game> joinableGame = gameProvider.getJoinablePublicGame();
        if (joinableGame.isPresent()) {
            Game game = joinableGame.get();
            Player player = new Player(playerId, WhichPlayer.PLAYER2);
            try {
                game.addSecondPlayer(player);
                websocketMessenger.sendJoinDataUser(playerId, game.getId(), false);
            } catch (Exception exception) {
                log.error(exception.getMessage(), exception);
                websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.ERROR, 500,
                        "Something went wrong.", exception.getMessage()));
            }
            return true;
        }
        return false;
    }

    public void startNewGame(boolean privateGame, UUID playerId) {
        Player player = new Player(playerId, WhichPlayer.PLAYER1);
        Game game = gameProvider.startNewGame(privateGame, player);
        websocketMessenger.sendJoinDataUser(playerId, game.getId(), false);
    }

    public GameDTO getGame(@NonNull UUID gameId, @NonNull UUID playerId) throws IllegalRequestException, GameNotFoundException {
        Game game = gameProvider.getGame(gameId);
        Player player = game.getPlayerById(playerId);
        return game.getGame(player);
    }

    public void connectToGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            game.connect(player);
            log.info("USER-%s joined GAME-%s".formatted(playerId, gameId));
            websocketMessenger.sendStateUpdateGlobal(game, null);
        } catch (GameNotFoundException exception) {
            websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.ERROR, 400,
                    "Game is no longer available.", exception.getMessage()));
        } catch (IllegalRequestException exception) {
            websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.ERROR, 403,
                    "You can't do that.", exception.getMessage()));
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    public void disconnectFromGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            boolean unfinished = !game.isOver();
            game.disconnect(player);
            log.info("USER-%s left GAME-%s".formatted(playerId, gameId));
            if (game.isOver()) {
                shutdownGame(game, unfinished);
            } else {
                websocketMessenger.sendStateUpdateGlobal(game, "Other player left. Wait for them to rejoin.");
            }
        } catch (GameNotFoundException ignore) {
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    public void forfeitGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            game.forfeitGame(player);
            log.info("USER-%s forfeited GAME-%s".formatted(playerId, gameId));
            if (game.isWon()) {
                websocketMessenger.sendOpponentBoardDataUser(game.getOpponent(player).getId(), player.getPlayerDataFull());
                websocketMessenger.sendWinnerGlobal(game.getId(), game.getWinner(), "%s forfeited.".formatted(player.getName()));
            } else {
                shutdownGame(game, true);
            }
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }

    private void shutdownGame(Game game, boolean unfinished) {
        if (unfinished && game.anyConnected()) {
            websocketMessenger.sendStateUpdateGlobal(game, "One of the players left.");
        }
        gameProvider.closeGame(game);
    }

}
