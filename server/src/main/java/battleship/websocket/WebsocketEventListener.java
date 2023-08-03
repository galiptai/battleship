package battleship.websocket;

import battleship.GameManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WebsocketEventListener {

    private final GameManager gameManager;

    @EventListener
    public void connectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (userId == null) {
            return;
        }
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("userId", userId);
    }
    @EventListener
    public void subscribeListener(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (destination == null || userId == null) {
            return;
        }
        System.out.println("sub");
        if (destination.startsWith("/game/")) {
            UUID gameId = UUID.fromString(destination.substring(6, 42));
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("gameId", gameId.toString());
            gameManager.joinGame(gameId, UUID.fromString(userId));
        }
    }

    @EventListener
    public void disconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
        String gameId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("gameId");

        if (gameId != null && userId != null) {
            headerAccessor.getSessionAttributes().remove("gameId");
            gameManager.leaveGame(UUID.fromString(gameId), UUID.fromString(userId));
        }
    }

}
