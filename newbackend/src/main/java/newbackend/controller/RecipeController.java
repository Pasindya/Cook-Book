package newbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import newbackend.exception.RecipeNotFoundException;
import newbackend.model.RecipeModel;
import newbackend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/recipes")
public class RecipeController {

    private final String UPLOAD_DIR = "recipe-uploads/"; // Different directory for recipe images

    @Autowired
    private RecipeRepository recipeRepository;

    // Create new recipe with image
    @PostMapping
    public ResponseEntity<?> createRecipe(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("steps") String steps,
            @RequestParam("time") String time,
            @RequestParam("type") String type,
            @RequestParam("category") String category,
            @RequestParam(value = "recipeImage", required = false) MultipartFile file) {

        try {
            RecipeModel recipe = new RecipeModel();
            recipe.setTitle(title);
            recipe.setDescription(description);
            recipe.setIngredients(ingredients);
            recipe.setSteps(steps);
            recipe.setTime(time);
            recipe.setType(type);
            recipe.setCategory(category);

            if (file != null && !file.isEmpty()) {
                String fileName = saveImage(file);
                recipe.setRecipeImage(fileName);
            }

            RecipeModel savedRecipe = recipeRepository.save(recipe);
            return ResponseEntity.ok(savedRecipe);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating recipe: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile file) throws IOException {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdir();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        file.transferTo(Paths.get(UPLOAD_DIR + fileName));
        return fileName;
    }

    // Get all recipes
    @GetMapping
    public List<RecipeModel> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // Get recipe by ID
    @GetMapping("/{id}")
    public ResponseEntity<RecipeModel> getRecipeById(@PathVariable String id) {
        return ResponseEntity.ok(recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException("Could not find recipe with id: " + id)));
    }

    // Get image
    @GetMapping("/images/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    // Update recipe
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("steps") String steps,
            @RequestParam("time") String time,
            @RequestParam("type") String type,
            @RequestParam("category") String category,
            @RequestParam(value = "recipeImage", required = false) MultipartFile file) {

        try {
            System.out.println("Received update request for recipe ID: " + id);

            // Find the existing recipe
            RecipeModel existingRecipe = recipeRepository.findById(id)
                    .orElseThrow(() -> {
                        System.err.println("Recipe not found with ID: " + id);
                        return new RecipeNotFoundException("Could not find recipe with id: " + id);
                    });

            // Update all fields
            existingRecipe.setTitle(title);
            existingRecipe.setDescription(description);
            existingRecipe.setIngredients(ingredients);
            existingRecipe.setSteps(steps);
            existingRecipe.setTime(time);
            existingRecipe.setType(type);
            existingRecipe.setCategory(category);

            // Handle image update
            if (file != null && !file.isEmpty()) {
                // Delete old image if exists
                if (existingRecipe.getRecipeImage() != null) {
                    File oldFile = new File(UPLOAD_DIR + existingRecipe.getRecipeImage());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }

                // Save new image
                String fileName = saveImage(file);
                existingRecipe.setRecipeImage(fileName);
            }

            // Save the updated recipe
            RecipeModel updatedRecipe = recipeRepository.save(existingRecipe);
            return ResponseEntity.ok(updatedRecipe);

        } catch (RecipeNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating recipe: " + e.getMessage());
        }
    }

    // Delete recipe
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable String id) {
        try {
            RecipeModel recipe = recipeRepository.findById(id)
                    .orElseThrow(() -> new RecipeNotFoundException("Could not find recipe with id: " + id));

            // Delete associated image if exists
            if (recipe.getRecipeImage() != null) {
                File imageFile = new File(UPLOAD_DIR + recipe.getRecipeImage());
                if (imageFile.exists()) {
                    imageFile.delete();
                }
            }

            recipeRepository.deleteById(id);
            return ResponseEntity.ok().build();

        } catch (RecipeNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting recipe: " + e.getMessage());
        }
    }


}