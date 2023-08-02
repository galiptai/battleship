package battleship.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebsocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/test")
    public String test(@Payload String message, SimpMessageHeaderAccessor headerAccessor) throws InterruptedException {
        String id = headerAccessor.getFirstNativeHeader("id");
        String response = "test " + message + " by " + id;
        for (int i = 0; i < 5; i++) {
            Thread.sleep(1000);
            messagingTemplate.convertAndSend("/game", response);
        }
        return "test";
    }
}
