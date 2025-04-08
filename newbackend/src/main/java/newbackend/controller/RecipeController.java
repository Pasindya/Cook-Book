package newbackend.controller;

import newbackend.model.RecipeModel;
import newbackend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "*")

public class RecipeController {
    @Autowired
    private RecipeRepository recipeRepository;

    // Add Recipe
    @PostMapping("/recipes")
    public RecipeModel newRecipeModel(@RequestBody RecipeModel newRecipeModel){
        return recipeRepository.save(newRecipeModel);
    }

    // Handle Image Upload
    @PostMapping("recipes/recipeImg")
    public String recipeImage(@RequestParam("file") MultipartFile file) {
        String folder = "uploads/"; // Corrected to store in resources folder
        String recipeImage = file.getOriginalFilename();

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }
            // Save the file to the specified directory
            file.transferTo(Paths.get(folder + recipeImage));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file: " + e.getMessage();
        }
        return recipeImage; // Return the image name
    }
}
