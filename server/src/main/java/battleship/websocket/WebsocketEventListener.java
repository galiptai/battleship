package battleship.websocket;

import battleship.service.GameConnectionService;
import battleship.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WebsocketEventListener {

    private final GameConnectionService gameConnectionService;
    private final UserService userService;

    @EventListener
    public void connectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = headerAccessor.getFirstNativeHeader("userId");
        if (userId == null) {
            return;
        }
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("userId", userId);
        userService.connectUser(UUID.fromString(userId), headerAccessor.getSessionId());
    }

    @EventListener
    public void disconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        UUID userId = UUID.fromString((String) Objects.requireNonNull(headerAccessor
                .getSessionAttributes()).get("userId"));
        String gameId = (String) headerAccessor.getSessionAttributes().get("gameId");
        userService.disconnectUser(userId, headerAccessor.getSessionId());

        if (gameId != null && !userService.isConnected(userId)) {
            gameConnectionService.disconnectFromGame(UUID.fromString(gameId), userId);
        }
    }

}
