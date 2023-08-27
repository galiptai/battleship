package battleship.dtos.messages;

public record ErrorDTO(ErrorType type, Integer statusCode, String userMessage, String errorMessage) {
}
