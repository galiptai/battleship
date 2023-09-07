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
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.UUID;

@Component
public class WebsocketChannelInterceptor implements ExecutorChannelInterceptor {

    private GameConnectionService gameConnectionService;
    private MessageChannel clientOutboundChannel;


    public void setGameConnectionService(GameConnectionService gameConnectionService) {
        this.gameConnectionService = gameConnectionService;
    }

    public void setClientOutboundChannel(MessageChannel clientOutboundChannel) {
        this.clientOutboundChannel = clientOutboundChannel;
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
    public void afterMessageHandled(@NonNull Message<?> message, @NonNull MessageChannel channel,
                                    @NonNull MessageHandler handler, Exception ex) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        if (handler instanceof SimpleBrokerMessageHandler) {
            handleReceipt(headerAccessor);
            if (headerAccessor.getCommand() == StompCommand.SUBSCRIBE) {
                handleOnSubEvents(headerAccessor);
            }
        }
        ExecutorChannelInterceptor.super.afterMessageHandled(message, channel, handler, ex);
    }

    private void handleReceipt(StompHeaderAccessor inAccessor) {
        String receipt = inAccessor.getReceipt();
        if (receipt == null) {
            return;
        }

        StompHeaderAccessor outAccessor = StompHeaderAccessor.create(StompCommand.RECEIPT);
        outAccessor.setSessionId(inAccessor.getSessionId());
        outAccessor.setReceiptId(receipt);
        outAccessor.setLeaveMutable(true);

        Message<byte[]> outMessage =
                MessageBuilder.createMessage(new byte[0], outAccessor.getMessageHeaders());

        clientOutboundChannel.send(outMessage);
    }

    private void handleOnSubEvents(StompHeaderAccessor headerAccessor) {
        String destination = Objects.requireNonNull(headerAccessor.getDestination());

        if (destination.startsWith("/game/") && destination.endsWith("/state")) {
            String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
            UUID gameId = UUID.fromString(destination.substring(6, 42));
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("gameId", gameId.toString());
            gameConnectionService.connectToGame(gameId, UUID.fromString(userId));
        }
    }
}
