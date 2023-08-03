package battleship.websocket;

import battleship.GameManager;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class WebsocketController {

    private final GameManager gameManager;

    @MessageMapping("/join/new")
    public void joinNewGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = getUserIdFromHeader(headerAccessor);

        gameManager.findNewGame(UUID.fromString(userId));
    }

    @MessageMapping("/join/rejoin")
    public void rejoinGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = getUserIdFromHeader(headerAccessor);
        String gameId = getGameIdFromHeader(headerAccessor);

        gameManager.attemptRejoin(UUID.fromString(gameId), UUID.fromString(userId));
    }

    @MessageMapping("/forfeit")
    public void forfeitGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = getUserIdFromHeader(headerAccessor);
        String gameId = getGameIdFromHeader(headerAccessor);

        gameManager.forfeitGame(UUID.fromString(gameId), UUID.fromString(userId));
    }

    private static String getUserIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (userId == null) {
            throw new RuntimeException("No user ID");
        }
        return userId;
    }

    private static String getGameIdFromHeader(SimpMessageHeaderAccessor headerAccessor) {
        String userId = headerAccessor.getFirstNativeHeader("gameId");
        if (userId == null) {
            throw new RuntimeException("No game ID");
        }
        return userId;
    }
}
