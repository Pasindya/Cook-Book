package Backend.controller;

import Backend.exception.ReviewNotFoundException;
import Backend.model.ReviewModel;
import Backend.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // Add new review
    @PostMapping("/reviews")
    public ReviewModel newReview(@RequestBody ReviewModel newReview) {
        return reviewRepository.save(newReview);
    }

    // Get all reviews
    @GetMapping("/reviews")
    public List<ReviewModel> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Get review by ID
    @GetMapping("/reviews/{id}")
    public ReviewModel getReviewById(@PathVariable String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id));
    }

    // Get reviews for a specific recipe
    @GetMapping("/reviews/recipe/{recipeId}")
    public List<ReviewModel> getReviewsByRecipeId(@PathVariable String recipeId) {
        return reviewRepository.findByRecipeId(recipeId);
    }

    // Update review by ID
    @PutMapping("/reviews/{id}")
    public ReviewModel updateReview(@RequestBody ReviewModel updatedReview, @PathVariable String id) {
        ReviewModel existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id));

        existingReview.setReviewerName(updatedReview.getReviewerName());
        existingReview.setReviewText(updatedReview.getReviewText());
        existingReview.setRating(updatedReview.getRating());
        existingReview.setReviewDate(updatedReview.getReviewDate());

        return reviewRepository.save(existingReview);
    }

    // Delete review by ID
    @DeleteMapping("/reviews/{id}")
    public String deleteReview(@PathVariable String id) {
        ReviewModel review = reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException(id));

        reviewRepository.deleteById(id);
        return "Review with ID " + id + " has been deleted.";
    }
}
