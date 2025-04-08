package newbackend.exception;

public class RecipeNotFoundException extends RuntimeException{
    public RecipeNotFoundException(Long id){
        super("could not find id" + id);
    }
    public RecipeNotFoundException(String message){
        super(message);
    }
}
