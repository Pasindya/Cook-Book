package newbackend.controller;

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
    @Autowired
    private RecipeRepository recipeRepository;

    private final String UPLOAD_DIR = "uploads/";

    // Get all recipes
    @GetMapping
    public ResponseEntity<?> getAllRecipes() {
        try {
            List<RecipeModel> recipes = recipeRepository.findAll();
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recipes: " + e.getMessage());
        }
    }

    // Get recipe by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable String id) {
        try {
            RecipeModel recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException("Could not find recipe with id: " + id));
            return ResponseEntity.ok(recipe);
        } catch (RecipeNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recipe: " + e.getMessage());
        }
    }

    // Get image
    @GetMapping("/images/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        try {
            File file = new File(UPLOAD_DIR + filename);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new FileSystemResource(file));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Add Recipe
    @PostMapping
    public ResponseEntity<?> newRecipeModel(@RequestBody RecipeModel newRecipeModel) {
        try {
            System.out.println("Received recipe data: " + newRecipeModel);
            RecipeModel savedRecipe = recipeRepository.save(newRecipeModel);
            return ResponseEntity.status(201).body(savedRecipe);
        } catch (Exception e) {
            System.out.println("Error creating recipe: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating recipe: " + e.getMessage());
        }
    }

    // Handle Image Upload
    @PostMapping("/upload-image")
    public ResponseEntity<?> recipeImage(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Received image upload request");
            
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                if (!created) {
                    throw new IOException("Failed to create uploads directory");
                }
            }
            
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destFile = new File(uploadDir, fileName);
            
            file.transferTo(destFile);
            System.out.println("Image saved successfully: " + fileName);
            
            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            System.out.println("Error uploading file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error uploading file: " + e.getMessage());
        }
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
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        try {
            RecipeModel existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException("Could not find recipe with id: " + id));

            // Update fields
            existingRecipe.setTitle(title);
            existingRecipe.setDescription(description);
            existingRecipe.setIngredients(ingredients);
            existingRecipe.setSteps(steps);
            existingRecipe.setTime(time);
            existingRecipe.setType(type);
            existingRecipe.setCategory(category);

            // Handle image update if provided
            if (file != null && !file.isEmpty()) {
                // Delete old image if exists
                if (existingRecipe.getRecipeImage() != null) {
                    File oldFile = new File(UPLOAD_DIR + existingRecipe.getRecipeImage());
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }

                // Save new image
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                file.transferTo(Paths.get(UPLOAD_DIR + fileName));
                existingRecipe.setRecipeImage(fileName);
            }

            RecipeModel updatedRecipe = recipeRepository.save(existingRecipe);
            return ResponseEntity.ok(updatedRecipe);

        } catch (RecipeNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating recipe: " + e.getMessage());
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
