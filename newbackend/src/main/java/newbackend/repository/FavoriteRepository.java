package newbackend.repository;

import newbackend.model.FavoriteModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends MongoRepository<FavoriteModel, String> {
}