package newbackend.exception;

public class CookingChallengeNotFoundException extends RuntimeException {
    public CookingChallengeNotFoundException(Long id){
        super("Could not find id" +id);
    }
    public CookingChallengeNotFoundException(String message){
        super(message);
    }
}
