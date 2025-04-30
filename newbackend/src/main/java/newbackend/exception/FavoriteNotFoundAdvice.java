package newbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class FavoriteNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(FavoriteNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String favoriteNotFoundHandler(FavoriteNotFoundException ex) {
        return ex.getMessage();
    }
}