package battleship.websocket;

import battleship.config.CustomScheduledExecutorService;
import battleship.service.GameConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class WebsocketEventListener {

    private final GameConnectionService gameConnectionService;
    private final CustomScheduledExecutorService executorService;

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
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
        if (destination == null) {
            return;
        }
        if (destination.startsWith("/game/") && destination.endsWith("/state")) {
            Runnable joinGame = () -> {
                UUID gameId = UUID.fromString(destination.substring(6, 42));
                Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("gameId", gameId.toString());
                gameConnectionService.joinGame(gameId, UUID.fromString(userId));
            };
            executorService.schedule(joinGame, 100L, TimeUnit.MILLISECONDS);
        }
    }

    @EventListener
    public void disconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
        String gameId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("gameId");

        if (gameId != null && userId != null) {
            headerAccessor.getSessionAttributes().remove("gameId");
            gameConnectionService.leaveGame(UUID.fromString(gameId), UUID.fromString(userId));
        }
    }

}
