package newbackend.controller;

import newbackend.exception.CookingChallengeNotFoundException;
import newbackend.model.CookingChallengesModel;
import newbackend.repository.CookingChallengesRepository;
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
@RequestMapping("/cookingchallenge")
// Base path for all methods

public class CookingChallengesController {
    @Autowired
    private CookingChallengesRepository cookingChallengesRepository;

    //insert
   @PostMapping("/cookingchallenge")
    public CookingChallengesModel newCookingChallengesModel(@RequestBody CookingChallengesModel newCookingChallengesModel){
        return cookingChallengesRepository.save(newCookingChallengesModel);

    }

    //add image
    @PostMapping("/cookingchallenge/challengeImage")
    public String challengeImage(@RequestParam("file") MultipartFile file){
        String folder = "uploads/";
        String challengeImage = file.getOriginalFilename();

        try{
            File uploadDir = new File(folder);
            if(!uploadDir.exists()){
                uploadDir.mkdir();
            }
            file.transferTo(Paths.get(folder+challengeImage));
        }catch(IOException e){
            e.printStackTrace();
            return "Error Uploading file;" + challengeImage;
        }
        return challengeImage;
    }

    //Display
    @GetMapping("/{id}")
    List<CookingChallengesModel> getAllChallengers() {return cookingChallengesRepository.findAll();}

    //catch the ID
    @GetMapping("/cookingchallenge/{id}")
    CookingChallengesModel getChallengeID (@PathVariable Long id){
        return cookingChallengesRepository.findById(id).orElseThrow(() -> new CookingChallengeNotFoundException(id));
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
