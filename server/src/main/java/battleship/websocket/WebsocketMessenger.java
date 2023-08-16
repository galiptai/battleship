package battleship.websocket;

import battleship.dtos.messages.ErrorDTO;
import battleship.dtos.messages.game.GameMessageType;
import battleship.dtos.messages.game.StateUpdateDTO;
import battleship.dtos.messages.join.JoinDTO;
import battleship.dtos.messages.join.JoinMessageType;
import battleship.game.Game;
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

    public void sendStateUpdateGlobal(@NonNull Game game) {
        messagingTemplate.convertAndSend("/game/" + game.getId() + "/",
                new StateUpdateDTO(game.getState()), Map.of("type", GameMessageType.STATE_CHANGE));
    }

    public void sendGameDataUser(@NonNull UUID playerId, @NonNull Game game) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game",
                new StateUpdateDTO(game.getState()), Map.of("type", GameMessageType.STATE_CHANGE));
    }

    public void sendJoinErrorUser(@NonNull UUID playerId, @NonNull String message) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/join",
                new ErrorDTO(message), Map.of("type", JoinMessageType.ERROR));
    }

    public void sendGameErrorUser(@NonNull UUID playerId, @NonNull String message) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game",
                new ErrorDTO(message), Map.of("type", GameMessageType.ERROR));
    }
}
