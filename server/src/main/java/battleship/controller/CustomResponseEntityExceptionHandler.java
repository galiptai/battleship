package battleship.controller;

import battleship.dtos.messages.ErrorDTO;
import battleship.dtos.messages.ErrorType;
import battleship.exceptions.*;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class CustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = InvalidRequestException.class)
    public ResponseEntity<ErrorDTO> handleInvalidRequest(Exception exception) {
        String errorMessage = exception.getMessage() == null ? "Invalid request." : exception.getMessage();
        return new ResponseEntity<>(new ErrorDTO(ErrorType.ERROR, 400,
                "Missing request parameters.", errorMessage), HttpStatusCode.valueOf(400));
    }

    @ExceptionHandler(value = IllegalRequestException.class)
    public ResponseEntity<ErrorDTO> handleIllegalRequest(Exception exception) {
        String errorMessage = exception.getMessage() == null ? "Illegal request." : exception.getMessage();
        return new ResponseEntity<>(new ErrorDTO(ErrorType.ERROR, 403,
                "You can't do that.", errorMessage), HttpStatusCode.valueOf(403));
    }

    @ExceptionHandler(value = GameNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleGameNotFound(Exception exception) {
        String errorMessage = exception.getMessage() == null ? "Game not found." : exception.getMessage();
        return new ResponseEntity<>(new ErrorDTO(ErrorType.ERROR, 404,
                "Game is no longer available.", errorMessage), HttpStatusCode.valueOf(404));
    }

    @ExceptionHandler(value = BoardException.class)
    public ResponseEntity<ErrorDTO> handleBoardException(Exception exception) {
        String errorMessage = exception.getMessage() == null ? "Board error." : exception.getMessage();
        return new ResponseEntity<>(new ErrorDTO(ErrorType.WARNING, 400,
                "Board data is invalid.", errorMessage), HttpStatusCode.valueOf(400));
    }

    @ExceptionHandler(value = InvalidActionException.class)
    public ResponseEntity<ErrorDTO> handleInvalidAction(Exception exception) {
        String errorMessage = exception.getMessage() == null ? "Invalid action." : exception.getMessage();
        return new ResponseEntity<>(new ErrorDTO(ErrorType.WARNING, 400,
                "You can't do that now.", errorMessage), HttpStatusCode.valueOf(400));
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ErrorDTO> handleGenericException(Exception exception) {
        String errorMessage = exception.getMessage() == null ? "Internal error." : exception.getMessage();
        return new ResponseEntity<>(new ErrorDTO(ErrorType.ERROR, 500,
                "Something went wrong.", errorMessage), HttpStatusCode.valueOf(500));
    }
}