package battleship.exceptions;

public class ConnectionRejectionException extends RuntimeException{
    public ConnectionRejectionException(String message) {
        super(message);
    }
}
