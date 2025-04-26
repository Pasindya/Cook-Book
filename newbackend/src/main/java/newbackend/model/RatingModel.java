package Backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ratings")
public class RatingModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int ratingValue; // e.g., 1 to 5

    private String comment;

    @Column(name = "reviewer_name")
    private String reviewerName;

    private Long reviewId; // To link rating to a review if needed

    public RatingModel() {
    }

    public RatingModel(int ratingValue, String comment, String reviewerName, Long reviewId) {
        this.ratingValue = ratingValue;
        this.comment = comment;
        this.reviewerName = reviewerName;
        this.reviewId = reviewId;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getRatingValue() {
        return ratingValue;
    }

    public void setRatingValue(int ratingValue) {
        this.ratingValue = ratingValue;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }
}
