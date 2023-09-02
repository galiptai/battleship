package battleship.websocket;

import battleship.service.GameConnectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.Objects;
import java.util.UUID;

@Controller()
@RequiredArgsConstructor
@Slf4j
public class WebsocketController {

    private final GameConnectionService gameConnectionService;

    @MessageMapping("/rejoin")
    public void getRejoinableGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");

        gameConnectionService.findRejoinableGame(UUID.fromString(userId));
    }

    @MessageMapping("/join")
    public void joinGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");

        gameConnectionService.findNewGame(UUID.fromString(userId));
    }

    @MessageMapping("/create-private")
    public void startPrivateGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");

        gameConnectionService.startNewGame(true, UUID.fromString(userId));
    }
    @MessageMapping("/join-private")
    private void joinPrivateGame(SimpMessageHeaderAccessor headerAccessor, @Payload String gameId) {
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");

        gameConnectionService.findSpecificGame(UUID.fromString(gameId), UUID.fromString(userId));
    }

    @MessageMapping("/forfeit")
    public void forfeitGame(SimpMessageHeaderAccessor headerAccessor, @Payload String  gameId) {
        String userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");

        gameConnectionService.forfeitGame(UUID.fromString(gameId), UUID.fromString(userId));
    }

    @SubscribeMapping("/topic")
    public void test1() {
        System.out.println("test1");
    }

    @SubscribeMapping("/game/{gameId}/state")
    public void test2() {
        System.out.println("test2");
    }
}
