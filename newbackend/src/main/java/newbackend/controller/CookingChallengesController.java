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
    public ResponseEntity<CookingChallengesModel> getChallengeById(@PathVariable String id) {
        return ResponseEntity.ok(cookingChallengesRepository.findById(id)
                .orElseThrow(() -> new CookingChallengeNotFoundException("Could not find challenge with id: " + id)));
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

    // Update challenge
    @PutMapping("/{id}")
    public ResponseEntity<?> updateChallenge(
            @PathVariable String id,
            @RequestParam("ChallengeTitle") String title,
            @RequestParam("challengeDetails") String details,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("Rules") String rules,
            @RequestParam(value = "challengeImage", required = false) MultipartFile file) {

        try {
            System.out.println("Received update request for challenge ID: " + id);
            System.out.println("Received data:");
            System.out.println("Title: " + title);
            System.out.println("Details: " + details);
            System.out.println("Start Date: " + startDate);
            System.out.println("End Date: " + endDate);
            System.out.println("Rules: " + rules);
            System.out.println("Has new image: " + (file != null && !file.isEmpty()));

            // Find the existing challenge
            CookingChallengesModel existingChallenge = cookingChallengesRepository.findById(id)
                    .orElseThrow(() -> {
                        System.err.println("Challenge not found with ID: " + id);
                        return new CookingChallengeNotFoundException("Could not find challenge with id: " + id);
                    });

            System.out.println("Found existing challenge: " + existingChallenge.getId());

            // Update all fields
            existingChallenge.setChallengeTitle(title);
            System.out.println("Updated title to: " + title);
            
            existingChallenge.setChallengeDetails(details);
            System.out.println("Updated details");
            
            existingChallenge.setStartDate(startDate);
            System.out.println("Updated start date to: " + startDate);
            
            existingChallenge.setEndDate(endDate);
            System.out.println("Updated end date to: " + endDate);
            
            existingChallenge.setRules(rules);
            System.out.println("Updated rules");

            // Handle image update
            if (file != null && !file.isEmpty()) {
                System.out.println("Processing new image: " + file.getOriginalFilename());
                
                // Delete old image if exists
                if (existingChallenge.getChallengeImage() != null) {
                    File oldFile = new File(UPLOAD_DIR + existingChallenge.getChallengeImage());
                    if (oldFile.exists()) {
                        boolean deleted = oldFile.delete();
                        System.out.println("Old image deletion " + (deleted ? "successful" : "failed"));
                    }
                }

                // Save new image
                String fileName = saveImage(file);
                existingChallenge.setChallengeImage(fileName);
                System.out.println("Saved new image: " + fileName);
            }

            // Save the updated challenge
            CookingChallengesModel updatedChallenge = cookingChallengesRepository.save(existingChallenge);
            System.out.println("Successfully saved updated challenge: " + updatedChallenge.getId());

            return ResponseEntity.ok(updatedChallenge);

        } catch (CookingChallengeNotFoundException e) {
            System.err.println("Challenge not found error: " + e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error updating challenge: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating challenge: " + e.getMessage());
        }
    }

    // Delete challenge
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChallenge(@PathVariable String id) {
        try {
            CookingChallengesModel challenge = cookingChallengesRepository.findById(id)
                    .orElseThrow(() -> new CookingChallengeNotFoundException("Could not find challenge with id: " + id));

            // Delete associated image if exists
            if (challenge.getChallengeImage() != null) {
                File imageFile = new File(UPLOAD_DIR + challenge.getChallengeImage());
                if (imageFile.exists()) {
                    imageFile.delete();
                }
            }

            cookingChallengesRepository.deleteById(id);
            return ResponseEntity.ok().build();

        } catch (CookingChallengeNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting challenge: " + e.getMessage());
        }
    }

}