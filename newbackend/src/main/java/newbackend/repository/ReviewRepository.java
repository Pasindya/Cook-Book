package newbackend.repository;

import newbackend.model.ReviewModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<ReviewModel, String> {
    List<ReviewModel> findByRecipeId(String recipeId);
    List<ReviewModel> findByUserId(String userId);
} 