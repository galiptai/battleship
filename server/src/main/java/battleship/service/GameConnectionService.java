package battleship.service;

import battleship.dtos.GameDTO;
import battleship.dtos.messages.ErrorDTO;
import battleship.dtos.messages.ErrorType;
import battleship.exceptions.GameNotFoundException;
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

    public void findGame(@NonNull UUID playerId) {
        if (findExistingGameWithPlayer(playerId)) {
            return;
        }
        if (joinGame(playerId)) {
            return;
        }
        startNewGame(playerId);
    }

    private boolean findExistingGameWithPlayer(UUID playerId) {
        Optional<Game> gamePlayerIsIn = gameProvider.getGamePlayerIsIn(playerId);
        if (gamePlayerIsIn.isPresent()) {
            Game game = gamePlayerIsIn.get();
            websocketMessenger.sendJoinDataUser(playerId, game.getId(), true);
            return true;
        }
        return false;
    }

    private boolean joinGame(UUID playerId) {
        Optional<Game> joinableGame = gameProvider.getJoinableGame();
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

    private void startNewGame(UUID playerId) {
        Player player = new Player(playerId, WhichPlayer.PLAYER1);
        Game game = gameProvider.startNewGame(player);
        websocketMessenger.sendJoinDataUser(playerId, game.getId(), false);
    }

//    public void findNewGame(@NonNull UUID playerId) {
//        try {
//            UUID gameId;
//            Game game = gameProvider.getJoinableGame().orElse(null);
//            if (game != null) {
//                Player player = new Player(playerId, WhichPlayer.PLAYER2);
//                game.addSecondPlayer(player);
//                gameId = game.getId();
//            } else {
//                Player player = new Player(playerId, WhichPlayer.PLAYER1);
//                gameId = gameProvider.startNewGame(player);
//            }
//
//            websocketMessenger.sendJoinDataUser(playerId, gameId);
//        } catch (InvalidRequestException exception) {
//            log.error(exception.getMessage(), exception);
//            websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.ERROR, 400,
//                    "You are already in this game.", exception.getMessage()));
//        } catch (Exception exception) {
//            log.error(exception.getMessage(), exception);
//            websocketMessenger.sendErrorUser(playerId, new ErrorDTO(ErrorType.ERROR, 500,
//                    "Something went wrong.", exception.getMessage()));
//        }
//    }
//
//    public void attemptRejoin(@NonNull UUID gameId, @NonNull UUID playerId) {
//        try {
//            Game game = gameProvider.getGame(gameId);
//            if (game.hasPlayerWithId(playerId) && game.isRejoinable()) {
//                websocketMessenger.sendJoinDataUser(playerId, gameId);
//            } else {
//                websocketMessenger.sendJoinDataUser(playerId, null);
//            }
//        } catch (Exception exception) {
//            websocketMessenger.sendJoinDataUser(playerId, null);
//        }
//    }

    public GameDTO getGame(@NonNull UUID gameId, @NonNull UUID playerId) throws IllegalRequestException, GameNotFoundException {
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

    public void leaveGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        try {
            Game game = gameProvider.getGame(gameId);
            Player player = game.getPlayerById(playerId);
            boolean alreadyOver = game.isOver();
            game.disconnect(player);
            log.info("Player %s left GAME-%s".formatted(playerId, gameId));
            if (game.isOver()) {
                if (!game.anyConnected()) {
                    gameProvider.closeGame(gameId);
                } else if (!alreadyOver) {
                    websocketMessenger.sendStateUpdateGlobal(game, "The other player left.");
                }
            } else {
                websocketMessenger.sendStateUpdateGlobal(game, "Other player left. Wait for them to rejoin.");
            }
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
            websocketMessenger.sendOpponentBoardDataUser(game.getOpponent(player).getId(), player.getPlayerDataFull());
            websocketMessenger.sendWinnerGlobal(game.getId(), game.getWinner(), "%s forfeited.".formatted(player.getName()));
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
        }
    }
}
