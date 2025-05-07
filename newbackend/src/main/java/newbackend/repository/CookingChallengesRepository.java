package newbackend.repository;

import newbackend.model.CookingChallengesModel;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CookingChallengesRepository extends MongoRepository<CookingChallengesModel, String> {
}


