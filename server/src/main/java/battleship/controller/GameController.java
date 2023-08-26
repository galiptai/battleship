package battleship.controller;

import battleship.dtos.BoardDTO;
import battleship.dtos.GameDTO;
import battleship.exceptions.*;
import battleship.game.board.Coordinate;
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
    public GameDTO gameGame(@PathVariable UUID gameId, @RequestParam UUID playerId)
            throws IllegalRequestException, GameNotFoundException {
        return gameConnectionService.getGame(gameId, playerId);
    }

    @PostMapping("/{gameId}/setBoard")
    public Boolean setBoard(@PathVariable UUID gameId, @RequestParam UUID playerId, @RequestBody BoardDTO boardData)
            throws InvalidActionException, BoardException, IllegalRequestException, GameNotFoundException,
            GameStateException, InvalidRequestException {
        return gamePlayService.setBoard(gameId, playerId, boardData);
    }

    @PostMapping("/{gameId}/guess")
    public Boolean makeGuess(@PathVariable UUID gameId, @RequestParam UUID playerId, @RequestBody Coordinate coordinate)
            throws InvalidActionException, IllegalRequestException, GameNotFoundException, GameStateException {
        return gamePlayService.makeGuess(gameId, playerId, coordinate);
    }
}
