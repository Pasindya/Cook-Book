package newbackend.controller;

import newbackend.model.ReviewModel;
import newbackend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;

    // Add a review to a recipe
    @PostMapping("/recipes/{recipeId}/reviews")
    public ReviewModel addReview(@PathVariable String recipeId, @RequestBody ReviewModel review) {
        review.setRecipeId(recipeId);
        review.setCreatedAt(new Date());
        review.setUpdatedAt(new Date());
        return reviewRepository.save(review);
    }

    // Get all reviews for a recipe
    @GetMapping("/recipes/{recipeId}/reviews")
    public List<ReviewModel> getReviews(@PathVariable String recipeId) {
        return reviewRepository.findByRecipeId(recipeId);
    }

    // Update a review
    @PutMapping("/reviews/{reviewId}")
    public ReviewModel updateReview(@PathVariable String reviewId, @RequestBody ReviewModel updatedReview) {
        Optional<ReviewModel> optionalReview = reviewRepository.findById(reviewId);
        if (optionalReview.isPresent()) {
            ReviewModel review = optionalReview.get();
            review.setRating(updatedReview.getRating());
            review.setComment(updatedReview.getComment());
            review.setUpdatedAt(new Date());
            return reviewRepository.save(review);
        }
        throw new RuntimeException("Review not found");
    }

    // Delete a review
    @DeleteMapping("/reviews/{reviewId}")
    public void deleteReview(@PathVariable String reviewId) {
        reviewRepository.deleteById(reviewId);
    }
} 