package battleship.game;

import battleship.dtos.BoardDTO;
import battleship.dtos.JoinDTO;
import battleship.dtos.gameupdates.StateUpdateDTO;
import battleship.game.board.Board;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GameManager {

    private final Map<UUID, Game> games;
    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public GameManager(SimpMessageSendingOperations messagingTemplate) {
        this.games = new HashMap<>();
        this.messagingTemplate = messagingTemplate;
    }

    public void findNewGame(@NonNull UUID playerId) {
        Player player = new Player(playerId);
        UUID gameId = null;
        for (Game game : games.values()) {
            if (game.addSecondPlayer(player)) {
                gameId = game.getId();
                break;
            }
        }
        if (gameId == null) {
            Game newGame = new Game(player);
            games.put(newGame.getId(), newGame);
            gameId = newGame.getId();
        }

        messagingTemplate.convertAndSendToUser(playerId.toString(), "/join", new JoinDTO(true, gameId.toString()));
    }

    public void attemptRejoin(@NonNull UUID gameId, @NonNull UUID playerID) {
        Game game = games.get(gameId);
        if (game != null && game.hasPlayerWithId(playerID)) {
            messagingTemplate.convertAndSendToUser(playerID.toString(), "/join", new JoinDTO(true, gameId.toString()));
        } else {
            messagingTemplate.convertAndSendToUser(playerID.toString() ,"/join", new JoinDTO(false, null));
        }
    }

    public void joinGame(@NonNull UUID gameId, @NonNull UUID playerID) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerID);
        game.connect(player);
        //TODO send existing data back to the joined player
        messagingTemplate.convertAndSend("/game/" + gameId + "/", new StateUpdateDTO(game.getState()));

    }

    public void leaveGame(@NonNull UUID gameId, @NonNull UUID playerID) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerID);
        player.setConnected(false);
        if (!game.anyConnected()) {
            games.remove(gameId);
        }
    }

    public void forfeitGame(@NonNull UUID gameId, @NonNull UUID playerId) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerId);

        game.forfeitGame(player);
        games.remove(gameId);
    }

    public void setBoard(@NonNull UUID gameId, @NonNull UUID playerId,@NonNull BoardDTO boardData) {
        Game game = getGame(gameId);
        Player player = game.getPlayerById(playerId);
        Board board = boardData.getBoard();
        if (player.setData(boardData.player(), board)) {
            System.out.println("yay!");
        }
    }

    private Game getGame(UUID gameId) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        return game;
    }

}
