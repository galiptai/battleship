package battleship.service;

import battleship.dtos.BoardDTO;
import battleship.exceptions.BoardException;
import battleship.exceptions.IllegalActionException;
import battleship.game.Game;
import battleship.game.Player;
import battleship.game.board.Board;
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

    public Boolean setBoard(@NonNull UUID gameId, @NonNull UUID playerId, @NonNull BoardDTO boardData) throws IllegalActionException, BoardException {
        Game game = gameProvider.getGame(gameId);
        Player player = game.getPlayerById(playerId);
        if (player.isSet()) {
            throw new IllegalActionException("Board has already been set");
        }
        Board board = DataConverter.convertAndVerifyBoard(boardData);
        player.setData(boardData.player(), board);
        Player opponent = game.getOpponent(player);
        if (opponent != null) {
            websocketMessenger.sendOpponentBoardDataUser(opponent.getId(), player.getPlayerDataRevealed());
        }
        if (game.isGameReady()) {
            game.start();
            websocketMessenger.sendStateUpdateGlobal(game);
        }
        return true;
    }

}
