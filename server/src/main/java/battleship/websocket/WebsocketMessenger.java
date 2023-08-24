package battleship.websocket;

import battleship.dtos.BoardDTO;
import battleship.dtos.messages.ErrorDTO;
import battleship.dtos.messages.game.GuessDTO;
import battleship.dtos.messages.game.GuessSunkDTO;
import battleship.dtos.messages.game.StateUpdateDTO;
import battleship.dtos.messages.game.WinnerDTO;
import battleship.dtos.messages.join.JoinDTO;
import battleship.dtos.messages.join.JoinMessageType;
import battleship.game.Game;
import battleship.game.Guess;
import battleship.game.ship.Ship;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WebsocketMessenger {

    private final SimpMessageSendingOperations messagingTemplate;

    public void sendJoinDataUser(@NonNull UUID playerId, UUID gameId) {
        if (gameId != null) {
            messagingTemplate.convertAndSendToUser(playerId.toString(), "/join",
                    new JoinDTO(true, gameId.toString()), Map.of("type", JoinMessageType.GAME_FOUND));
        } else {
            messagingTemplate.convertAndSendToUser(playerId.toString(), "/join",
                    new JoinDTO(false, null), Map.of("type", JoinMessageType.GAME_FOUND));
        }
    }
    public void sendJoinErrorUser(@NonNull UUID playerId, @NonNull String message) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/join",
                new ErrorDTO(message), Map.of("type", JoinMessageType.ERROR));
    }

    public void sendStateUpdateGlobal(@NonNull Game game, String message) {
        messagingTemplate.convertAndSend("/game/" + game.getId() + "/state",
                new StateUpdateDTO(game.getState(), message));
    }

    public void sendOpponentBoardDataUser(@NonNull UUID playerId, @NonNull BoardDTO boardData) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game/setup",
                boardData);
    }

    public void sendGameErrorUser(@NonNull UUID playerId, @NonNull String message) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game/error",
                new ErrorDTO(message));
    }
    public void sendGuessGlobal(@NonNull Game game, @NonNull Guess guess) {
        messagingTemplate.convertAndSend("/game/" + game.getId() + "/guess",
                new GuessDTO(guess));
    }

    public void sendGuessUser(@NonNull UUID playerId, @NonNull Guess guess) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game/guess",
                new GuessDTO(guess));
    }

    public void sendGuessSunkUser(@NonNull UUID playerId, @NonNull Guess guess, @NonNull Ship ship) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game/guess_sunk",
                new GuessSunkDTO(guess, ship));
    }

    public void sendWinnerGlobal(@NonNull Game game, String message) {
        messagingTemplate.convertAndSend("/game/" + game.getId() + "/winner",
                new WinnerDTO(game.getWinner(), message));
    }
}
