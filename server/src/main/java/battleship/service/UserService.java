package battleship.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class UserService {

    private final Map<UUID, Set<String>> users;

    public UserService() {
        users = new HashMap<>();
    }

    public void connectUser(UUID userId, String sessionId) {
        if (users.containsKey(userId)) {
            users.get(userId).add(sessionId);
        } else {
            Set<String> sessions = new HashSet<>();
            sessions.add(sessionId);
            users.put(userId, sessions);
        }
        log.info("USER-%s connected with SESSION-%s".formatted(userId, sessionId));
    }

    public void disconnectUser(UUID userId, String sessionId) {
        if (!users.containsKey(userId)) {
            throw new RuntimeException("User not connected!");
        }
        Set<String> sessions = users.get(userId);
        sessions.remove(sessionId);
        log.info("USER-%s disconnected with SESSION-%s.".formatted(userId, sessionId));
        if (sessions.isEmpty()) {
            users.remove(userId);
            log.info("USER-%s disconnected completely.".formatted(userId));
        }
    }

    public boolean isConnected(UUID userId) {
        return users.containsKey(userId);
    }
}
