package battleship.controller;

import battleship.dtos.BoardDTO;
import battleship.dtos.GameDTO;
import battleship.exceptions.BoardException;
import battleship.exceptions.IllegalActionException;
import battleship.service.GameConnectionService;
import battleship.service.GamePlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/game")
public class GameController {

    private final GameConnectionService gameConnectionService;
    private final GamePlayService gamePlayService;

    @GetMapping("/{gameId}")
    public GameDTO gameGame(@PathVariable UUID gameId, @RequestParam UUID playerId) throws IllegalActionException {
        return gameConnectionService.getGame(gameId, playerId);
    }

    @PostMapping("/{gameId}/setBoard")
    public Boolean setBoard(@PathVariable UUID gameId, @RequestParam UUID playerId, @RequestBody BoardDTO boardData)
            throws IllegalActionException, BoardException {
        return gamePlayService.setBoard(gameId, playerId, boardData);
    }
}
