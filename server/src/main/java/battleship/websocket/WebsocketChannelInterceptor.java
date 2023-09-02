package battleship.websocket;

import battleship.exceptions.ConnectionRejectionException;
import battleship.service.GameConnectionService;
import lombok.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.simp.broker.SimpleBrokerMessageHandler;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ExecutorChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.UUID;

@Component
public class WebsocketChannelInterceptor implements ExecutorChannelInterceptor {

    private GameConnectionService gameConnectionService;

    public void setGameConnectionService(GameConnectionService gameConnectionService) {
        this.gameConnectionService = gameConnectionService;
    }

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        if (headerAccessor.getCommand() == StompCommand.CONNECT) {
            checkIdentification(headerAccessor);
        }
        return ExecutorChannelInterceptor.super.preSend(message, channel);
    }

    private static void checkIdentification(StompHeaderAccessor headerAccessor) {
        try {
            String userId = Objects.requireNonNull(headerAccessor.getFirstNativeHeader("userId"));
            UUID.fromString(userId);
        } catch (NullPointerException exception) {
            throw new ConnectionRejectionException("Connection rejected - No user ID");
        } catch (IllegalArgumentException exception) {
            throw new ConnectionRejectionException("Connection rejected - Invalid user ID");
        }
    }

    @Override
    public void afterMessageHandled(Message<?> message, MessageChannel channel, MessageHandler handler, Exception ex) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        if (handler instanceof SimpleBrokerMessageHandler) {
            handleUserGameJoin(headerAccessor);
        }
        ExecutorChannelInterceptor.super.afterMessageHandled(message, channel, handler, ex);
    }

    private void handleUserGameJoin(StompHeaderAccessor headerAccessor) {

        if (headerAccessor.getCommand() == StompCommand.SUBSCRIBE) {
            String destination = Objects.requireNonNull(headerAccessor.getDestination());
            String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");

            if (destination.startsWith("/game/") && destination.endsWith("/state")) {
                UUID gameId = UUID.fromString(destination.substring(6, 42));
                Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("gameId", gameId.toString());
                gameConnectionService.connectToGame(gameId, UUID.fromString(userId));
            }
        }
    }
}
