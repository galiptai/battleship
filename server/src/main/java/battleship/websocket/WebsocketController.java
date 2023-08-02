package battleship.websocket;

import battleship.GameService;
import battleship.dtos.JoinDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class WebsocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameService gameService;

    @MessageMapping("/test")
    public String test(@Payload String message, SimpMessageHeaderAccessor headerAccessor) throws InterruptedException {
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (userId == null) {
            throw new RuntimeException("No user id");
        }
        String response = "test " + message + " by " + userId;
        for (int i = 0; i < 5; i++) {
            Thread.sleep(1000);
            messagingTemplate.convertAndSend("/game", response);
        }
        return "test";
    }

    @MessageMapping("/join/new")
    public void joinNewGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (userId == null) {
            throw new RuntimeException("No user id");
        }

        UUID gameId = gameService.findNewGame(UUID.fromString(userId));
        messagingTemplate.convertAndSend("/user/" + userId + "/join", new JoinDTO(true, gameId.toString()));

    }

    @MessageMapping("/join/rejoin")
    public void rejoinGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (userId == null) {
            throw new RuntimeException("No user id");
        }
        String gameId = headerAccessor.getFirstNativeHeader("gameId");
        if (gameId == null) {
            throw new RuntimeException("No game id");
        }

        if (gameService.gameRejoinable(UUID.fromString(userId), UUID.fromString(gameId))) {
            messagingTemplate.convertAndSend("/user/" + userId + "/join", new JoinDTO(true, gameId));
        } else {
            messagingTemplate.convertAndSend("/user/" + userId + "/join", new JoinDTO(false, null));
        }
    }
}
