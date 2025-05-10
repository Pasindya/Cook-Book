package newbackend.controller;

import newbackend.model.Reminder;
import newbackend.repository.ReminderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private ReminderRepository reminderRepository;

    @PostMapping
    public Reminder createReminder(@RequestBody Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    @GetMapping("/user/{userId}")
    public List<Reminder> getReminders(@PathVariable Long userId) {
        return reminderRepository.findByUserId(userId);
    }

    @GetMapping
    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteReminder(@PathVariable Long id) {
        reminderRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Reminder updateReminder(@PathVariable Long id, @RequestBody Reminder updated) {
        return reminderRepository.findById(id)
                .map(reminder -> {
                    reminder.setRemindAt(updated.getRemindAt());
                    reminder.setChallengeId(updated.getChallengeId());
                    reminder.setUserId(updated.getUserId());
                    return reminderRepository.save(reminder);
                })
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
    }
}
