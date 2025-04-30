package newbackend.service;

import newbackend.model.FavoriteModel;
import newbackend.exception.FavoriteNotFoundException;
import java.util.List;

public interface FavoriteService {
    FavoriteModel addFavorite(FavoriteModel favorite);
    List<FavoriteModel> getAllFavorites();
    FavoriteModel getFavoriteById(String id) throws FavoriteNotFoundException;
    FavoriteModel updateFavorite(String id, FavoriteModel favorite) throws FavoriteNotFoundException;
    void deleteFavorite(String id) throws FavoriteNotFoundException;
} 