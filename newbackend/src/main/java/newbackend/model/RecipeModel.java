package newbackend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
public class RecipeModel {

    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private String description;
    private String recipeImage;
    private String ingredients;
    private String steps;
    private String time;
    private String type;
    private String category;


    public RecipeModel(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRecipeImage() {
        return recipeImage;
    }

    public void setRecipeImage(String recipeImage) {
        this.recipeImage = recipeImage;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public RecipeModel(Long id, String title, String description, String recipeImage, String ingredients, String steps, String time, String type, String category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.recipeImage = recipeImage;
        this.ingredients = ingredients;
        this.steps = steps;
        this.time = time;
        this.type = type;
        this.category = category;
    }
}
