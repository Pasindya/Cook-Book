package newbackend.repository;

import newbackend.model.RecipeModel;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeRepository extends MongoRepository<RecipeModel,Long> {


}
