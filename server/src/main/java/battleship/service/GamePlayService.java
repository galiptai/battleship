package battleship.service;

import battleship.dtos.BoardDTO;
import battleship.exceptions.*;
import battleship.game.Game;
import battleship.game.Guess;
import battleship.game.Player;
import battleship.game.board.Board;
import battleship.game.board.Coordinate;
import battleship.game.ship.Ship;
import battleship.utilities.DataConverter;
import battleship.websocket.WebsocketMessenger;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class GamePlayService {

    private final GameProvider gameProvider;

    private final WebsocketMessenger websocketMessenger;

    public Boolean setBoard(@NonNull UUID gameId, @NonNull UUID playerId, @NonNull BoardDTO boardData)
            throws IllegalRequestException, InvalidActionException, BoardException, GameNotFoundException,
            GameStateException, InvalidRequestException {
        Game game = gameProvider.getGame(gameId);
        Player player = game.getPlayerById(playerId);
        if (player.isSet()) {
            throw new InvalidActionException("Board has already been set.");
        }
        Board board = DataConverter.convertAndVerifyBoard(boardData);
        player.setData(boardData.player(), board);
        Player opponent = game.getOpponent(player);
        if (opponent != null) {
            websocketMessenger.sendOpponentBoardDataUser(opponent.getId(), player.getPlayerDataRevealed());
        }
        if (game.isGameReady()) {
            game.start();
            websocketMessenger.sendStateUpdateGlobal(game, null);
        }
        return true;
    }

    public Boolean makeGuess(UUID gameId, UUID playerId, Coordinate coordinate) throws IllegalRequestException,
            InvalidActionException, GameNotFoundException, GameStateException {
        Game game = gameProvider.getGame(gameId);
        Player player = game.getPlayerById(playerId);
        Guess guess = game.makeGuess(player, coordinate);

        if (guess.isSunk()) {
            Player opponent = game.getOpponent(player);
            Ship ship = game.getShip(opponent, coordinate);
            websocketMessenger.sendGuessUser(opponent.getId(), guess);
            websocketMessenger.sendGuessSunkUser(playerId, guess, ship);
            if (game.isWon()) {
                websocketMessenger.sendOpponentBoardDataUser(opponent.getId(), player.getPlayerDataFull());
                websocketMessenger.sendWinnerGlobal(game.getId(), game.getWinner(), null);
                return true;
            }
        } else {
            websocketMessenger.sendGuessGlobal(game, guess);
        }
        websocketMessenger.sendStateUpdateGlobal(game, null);

        return true;
    }
}
