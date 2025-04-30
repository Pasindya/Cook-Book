package newbackend.service;

import newbackend.model.FavoriteModel;
import newbackend.exception.FavoriteNotFoundException;
import newbackend.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    @Autowired
    public FavoriteServiceImpl(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public FavoriteModel addFavorite(FavoriteModel favorite) {
        return favoriteRepository.save(favorite);
    }

    @Override
    public List<FavoriteModel> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    @Override
    public FavoriteModel getFavoriteById(String id) throws FavoriteNotFoundException {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new FavoriteNotFoundException("Favorite not found with id: " + id));
    }

    @Override
    public FavoriteModel updateFavorite(String id, FavoriteModel favorite) throws FavoriteNotFoundException {
        if (!favoriteRepository.existsById(id)) {
            throw new FavoriteNotFoundException("Favorite not found with id: " + id);
        }
        favorite.setId(id);
        return favoriteRepository.save(favorite);
    }

    @Override
    public void deleteFavorite(String id) throws FavoriteNotFoundException {
        if (!favoriteRepository.existsById(id)) {
            throw new FavoriteNotFoundException("Favorite not found with id: " + id);
        }
        favoriteRepository.deleteById(id);
    }
} 