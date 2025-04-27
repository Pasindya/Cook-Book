package newbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
@RequestMapping("/api/challenges")
public class CookingChallengesController {

    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    private CookingChallengesRepository cookingChallengesRepository;

    // Create new challenge with image
    @PostMapping
    public ResponseEntity<?> createChallenge(
            @RequestParam("ChallengeTitle") String title,
            @RequestParam("challengeDetails") String details,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("Rules") String rules,
            @RequestParam(value = "challengeImage", required = false) MultipartFile file) {

        try {
            CookingChallengesModel challenge = new CookingChallengesModel();
            challenge.setChallengeTitle(title);
            challenge.setChallengeDetails(details);
            challenge.setStartDate(startDate);
            challenge.setEndDate(endDate);
            challenge.setRules(rules);

            if (file != null && !file.isEmpty()) {
                String fileName = saveImage(file);
                challenge.setChallengeImage(fileName);
            }

            CookingChallengesModel savedChallenge = cookingChallengesRepository.save(challenge);
            return ResponseEntity.ok(savedChallenge);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating challenge: " + e.getMessage());
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

    // Get all challenges
    @GetMapping
    public List<CookingChallengesModel> getAllChallenges() {
        return cookingChallengesRepository.findAll();
    }

    // Get challenge by ID
    @GetMapping("/{id}")
    public ResponseEntity<CookingChallengesModel> getChallengeById(@PathVariable Long id) {
        return ResponseEntity.ok(cookingChallengesRepository.findById(id)
                .orElseThrow(() -> new CookingChallengeNotFoundException(id)));
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

    //update
    @PutMapping("/cookingchallenge/{id}")
    public CookingChallengesModel updateCooking(
            @RequestPart(value = "challengeDetails")String challengeDetails,
            @RequestPart(value = "file",required = false) MultipartFile file,
            @PathVariable Long id
    ) {
        System.out.println("Challenge Details:" + challengeDetails);
        if (file != null) {
            System.out.println("File Received:" + file.getOriginalFilename());
        } else {
            System.out.println("no file uploaded");
        }
        ObjectMapper mapper = new ObjectMapper();
        CookingChallengesModel newCookingChallengers;
        try {
            newCookingChallengers = mapper.readValue(challengeDetails, CookingChallengesModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Error passing Itemdetails", e);
        }

        return cookingChallengesRepository.findById(id).map(existingCookingChallenge -> {

            existingCookingChallenge.setChallengeTitle(newCookingChallengers.getChallengeTitle());
            existingCookingChallenge.setChallengeDetails(newCookingChallengers.getChallengeDetails());
            existingCookingChallenge.setStartDate(newCookingChallengers.getStartDate());
            existingCookingChallenge.setEndDate(newCookingChallengers.getEndDate());
            existingCookingChallenge.setRules(newCookingChallengers.getRules());

            if(file != null && !file.isEmpty()) {
                String folder = "uploads/";
                String ChallengeImage = file.getOriginalFilename();
                try {
                    file.transferTo(Paths.get(folder + ChallengeImage));
                    existingCookingChallenge.setChallengeImage(ChallengeImage);
                } catch (IOException e) {
                    throw new RuntimeException("Error saving uploaded file", e);
                }
            }

            return cookingChallengesRepository.save(existingCookingChallenge);

        }).orElseThrow(() -> new CookingChallengeNotFoundException(id));

    }



}