package newbackend.controller;

import newbackend.model.CookingChallengesModel;
import newbackend.repository.CookingChallengesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "*")
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

}
