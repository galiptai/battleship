package battleship.websocket;

import battleship.dtos.JoinDTO;
import battleship.dtos.gameupdates.StateUpdateDTO;
import battleship.game.Game;
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

    public void sendStateUpdateGlobal(@NonNull Game game) {
        messagingTemplate.convertAndSend("/game/" + game.getId() + "/",
                new StateUpdateDTO(game.getState()));
    }

    public void sendGameDataUser(@NonNull UUID playerId, @NonNull Game game) {
        messagingTemplate.convertAndSendToUser(playerId.toString(), "/game",
                new StateUpdateDTO(game.getState()));
    }
}
