package Backend.Repository;

import Backend.model.ReviewModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<ReviewModel, String> {
    // ✅ Add this new method to find all reviews for a specific recipe
    List<ReviewModel> findByRecipeId(String recipeId);
}
