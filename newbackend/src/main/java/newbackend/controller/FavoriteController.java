package newbackend.controller;

import newbackend.model.FavoriteModel;
import newbackend.service.FavoriteService;
import newbackend.exception.FavoriteNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<FavoriteModel> newFavorite(@RequestBody FavoriteModel newFavorite) {
        try {
            FavoriteModel savedFavorite = favoriteService.addFavorite(newFavorite);
            return new ResponseEntity<>(savedFavorite, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<FavoriteModel>> getAllFavorites() {
        try {
            List<FavoriteModel> favorites = favoriteService.getAllFavorites();
            return new ResponseEntity<>(favorites, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FavoriteModel> getFavoriteById(@PathVariable String id) {
        try {
            FavoriteModel favorite = favoriteService.getFavoriteById(id);
            return new ResponseEntity<>(favorite, HttpStatus.OK);
        } catch (FavoriteNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FavoriteModel> updateFavorite(@RequestBody FavoriteModel updatedFavorite, @PathVariable String id) {
        try {
            FavoriteModel favorite = favoriteService.updateFavorite(id, updatedFavorite);
            return new ResponseEntity<>(favorite, HttpStatus.OK);
        } catch (FavoriteNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable String id) {
        try {
            favoriteService.deleteFavorite(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (FavoriteNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}