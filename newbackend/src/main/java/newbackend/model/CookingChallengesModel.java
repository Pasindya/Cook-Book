package newbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "challengers")// MongoDB collection name
public class CookingChallengesModel {
    @Id
    private String id;
    private String ChallengeTitle;
    private String challengeDetails;
    private String challengeImage;
    private String startDate;
    private String endDate;
    private String Rules;

    public CookingChallengesModel(){

    }

    public CookingChallengesModel(String id, String challengeTitle, String challengeDetails, String challengeImage, String startDate, String endDate, String rules) {
        this.id = id;
        ChallengeTitle = challengeTitle;
        this.challengeDetails = challengeDetails;
        this.challengeImage = challengeImage;
        this.startDate = startDate;
        this.endDate = endDate;
        Rules = rules;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getChallengeTitle() {
        return ChallengeTitle;
    }

    public void setChallengeTitle(String challengeTitle) {
        ChallengeTitle = challengeTitle;
    }

    public String getChallengeDetails() {
        return challengeDetails;
    }

    public void setChallengeDetails(String challengeDetails) {
        this.challengeDetails = challengeDetails;
    }

    public String getChallengeImage() {
        return challengeImage;
    }

    public void setChallengeImage(String challengeImage) {
        this.challengeImage = challengeImage;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getRules() {
        return Rules;
    }

    public void setRules(String rules) {
        Rules = rules;
    }
}
