package battleship.websocket;

import battleship.dtos.messages.ErrorDTO;
import battleship.dtos.messages.ErrorType;
import battleship.exceptions.InvalidRequestException;
import battleship.service.GameConnectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.Objects;
import java.util.UUID;

@Controller()
@RequiredArgsConstructor
@Slf4j
public class WebsocketController {

    private final GameConnectionService gameConnectionService;
    private final WebsocketMessenger websocketMessenger;

    @MessageMapping("/join")
    public void  joinGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = null;
        try {
            userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
        } catch (Exception exception) {
            handleException(exception, userId);
            return;
        }

        gameConnectionService.findGame(UUID.fromString(userId));
    }

//    @MessageMapping("/join/new")
//    public void joinNewGame(SimpMessageHeaderAccessor headerAccessor) {
//        String userId = null;
//        try {
//            userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
//        } catch (Exception exception) {
//            handleException(exception, userId);
//            return;
//        }
//
//        gameConnectionService.findNewGame(UUID.fromString(userId));
//    }
//
//    @MessageMapping("/join/rejoin")
//    public void rejoinGame(SimpMessageHeaderAccessor headerAccessor) {
//        String userId = null, gameId;
//        try {
//            userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
//            gameId = getGameIdFromHeader(headerAccessor);
//        } catch (Exception exception) {
//            handleException(exception, userId);
//            return;
//        }
//
//        gameConnectionService.attemptRejoin(UUID.fromString(gameId), UUID.fromString(userId));
//    }

    @MessageMapping("/forfeit")
    public void forfeitGame(SimpMessageHeaderAccessor headerAccessor) {
        String userId = null, gameId;
        try {
            userId = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("userId");
            gameId = getGameIdFromHeader(headerAccessor);
        } catch (Exception exception) {
            handleException(exception, userId);
            return;
        }

        gameConnectionService.forfeitGame(UUID.fromString(gameId), UUID.fromString(userId));
    }

    private void handleException(Exception exception, String userId) {
        log.error(exception.getMessage(), exception);
        if (userId != null) {
            websocketMessenger.sendErrorUser(UUID.fromString(userId), new ErrorDTO(ErrorType.ERROR,
                    400, "Missing request parameters.", exception.getMessage()));
        }
    }

    private static String getGameIdFromHeader(SimpMessageHeaderAccessor headerAccessor) throws InvalidRequestException {
        String userId = headerAccessor.getFirstNativeHeader("gameId");
        if (userId == null) {
            throw new InvalidRequestException("No game ID in headers.");
        }
        return userId;
    }
}
