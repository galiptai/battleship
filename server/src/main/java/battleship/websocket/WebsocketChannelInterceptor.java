package battleship.websocket;

import battleship.exceptions.ConnectionRejectionException;
import lombok.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;

import java.util.Objects;
import java.util.UUID;

public class WebsocketChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        if (headerAccessor.getCommand() == StompCommand.CONNECT) {
            try {
                String userId = Objects.requireNonNull(headerAccessor.getFirstNativeHeader("userId"));
                UUID.fromString(userId);
            } catch (NullPointerException exception) {
                throw new ConnectionRejectionException("Connection rejected - No user ID");
            } catch (IllegalArgumentException exception) {
                throw new ConnectionRejectionException("Connection rejected - Invalid user ID");
            }
        }
        return ChannelInterceptor.super.preSend(message, channel);
    }
}
