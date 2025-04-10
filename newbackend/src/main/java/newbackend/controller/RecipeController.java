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

    @GetMapping("/recipes")
    List<RecipeModel> getAllRecipes(){return recipeRepository.findAll();}
 //data display
    @GetMapping("/recipes/{id}")
    RecipeModel getRecipeId (@PathVariable Long id){
        return recipeRepository.findById(id).orElseThrow(() -> new RecipeNotFoundException(id));

    }
//display image
    private final String UPLOAD_DIR = "uploads/";
    @GetMapping("uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename){
        File file = new File(UPLOAD_DIR + filename);
        if(!file.exists()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }
}
