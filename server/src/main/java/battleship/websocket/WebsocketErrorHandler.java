package battleship.websocket;

import battleship.exceptions.ConnectionRejectionException;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

@Component
public class WebsocketErrorHandler extends StompSubProtocolErrorHandler {

    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        if (ex.getCause() != null && ex.getCause() instanceof ConnectionRejectionException) {
            ex = ex.getCause();
        }
        return super.handleClientMessageProcessingError(clientMessage, ex);
    }
}
