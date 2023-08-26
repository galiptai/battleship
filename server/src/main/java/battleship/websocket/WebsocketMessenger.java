package battleship.websocket;

import battleship.dtos.BoardDTO;
import battleship.dtos.messages.*;
import battleship.game.Game;
import battleship.game.Guess;
import battleship.game.WhichPlayer;
import battleship.game.ship.Ship;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WebsocketMessenger {

    private final SimpMessageSendingOperations messagingTemplate;

    public void sendJoinDataUser(@NonNull UUID playerId, UUID gameId) {
        if (gameId != null) {
            messagingTemplate.convertAndSendToUser(playerId.toString(), "/join",
                    new JoinDTO(true, gameId.toString()));
        } else {
            messagingTemplate.convertAndSendToUser(playerId.toString(), "/join",
                    new JoinDTO(false, null));
        }
    }

    public void sendStateUpdateGlobal(@NonNull Game game, String message) {
        messagingTemplate.convertAndSend("/game/" + game.getId() + "/state",
                new StateUpdateDTO(game.getState(), message));
    }

    public void sendOpponentBoardDataUser(@NonNull UUID playerId, @NonNull BoardDTO boardData) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game/setup",
                boardData);
    }

    public void sendErrorUser(@NonNull UUID playerId, @NonNull ErrorDTO error ) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/error",
                error);
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

    public void sendWinnerGlobal(@NonNull UUID gameId, @NonNull WhichPlayer winner, String message) {
        messagingTemplate.convertAndSend("/game/" + gameId + "/winner",
                new WinnerDTO(winner, message));
    }
}
