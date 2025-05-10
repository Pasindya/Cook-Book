package newbackend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/challenges")
public class ParticipantController {

    @GetMapping("/{challengeId}/participants")
    public List<Object> getParticipants(@PathVariable Long challengeId) {
        // Return participant data (even if it's an empty list for now)
        return new ArrayList<>();
    }
}
