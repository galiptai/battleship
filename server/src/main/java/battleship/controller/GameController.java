package battleship.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public GameController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    @MessageMapping("/test")
    public String test(@Payload String message) throws InterruptedException {
        System.out.println(message);
        String response = "test " + message;
        for (int i = 0; i < 5; i++) {
            Thread.sleep(1000);
            messagingTemplate.convertAndSend("/game", response);
        }
        return "test";
    }
}
