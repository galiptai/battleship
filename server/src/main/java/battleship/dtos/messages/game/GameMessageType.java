package battleship.dtos.messages.game;

public enum GameMessageType {
    ERROR,
    STATE_CHANGE,
    OPPONENT_BOARD,
    GUESS,
    GUESS_SUNK
}
