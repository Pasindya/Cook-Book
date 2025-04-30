package newbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "favorites")
public class FavoriteModel {

    @Id
    private String id;

    private String recipeName;
    private LocalDateTime reminderDateTime;

    // Default constructor required by MongoDB
    public FavoriteModel() {
    }

    // Parameterized constructor for convenience
    public FavoriteModel(String recipeName, LocalDateTime reminderDateTime) {
        this.recipeName = recipeName;
        this.reminderDateTime = reminderDateTime;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipeName() {
        return recipeName;
    }

    public void setRecipeName(String recipeName) {
        this.recipeName = recipeName;
    }

    public LocalDateTime getReminderDateTime() {
        return reminderDateTime;
    }

    public void setReminderDateTime(LocalDateTime reminderDateTime) {
        this.reminderDateTime = reminderDateTime;
    }

    // Optional: toString() method for better logging/debugging
    @Override
    public String toString() {
        return "FavoriteModel{" +
                "id='" + id + '\'' +
                ", recipeName='" + recipeName + '\'' +
                ", reminderDateTime=" + reminderDateTime +
                '}';
    }
}