package model;

import java.io.Serializable;

public class Car implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String brand;
    private String model;
    private double pricePerDay;
    private boolean isAvailable;
    private String image;
    private String description;
    private double totalRating;
    private int ratingCount;

    public Car() {
    }

    public Car(String id, String brand, String model, double pricePerDay, boolean isAvailable, String image,
            String description, double totalRating, int ratingCount) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.isAvailable = isAvailable;
        this.image = image;
        this.description = description;
        this.totalRating = totalRating;
        this.ratingCount = ratingCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description != null ? description.replace("|", "") : "";
    }

    public double getTotalRating() {
        return totalRating;
    }

    public void setTotalRating(double totalRating) {
        this.totalRating = totalRating;
    }

    public int getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(int ratingCount) {
        this.ratingCount = ratingCount;
    }

    public double getAverageRating() {
        if (ratingCount == 0)
            return 0;
        return totalRating / ratingCount;
    }

    @Override
    public String toString() {
        String img = (image == null) ? "" : image;
        String desc = (description == null) ? "" : description;
        return id + "|" + brand + "|" + model + "|" + pricePerDay + "|" + isAvailable + "|" + img + "|" + desc + "|"
                + totalRating + "|" + ratingCount;
    }

    public static Car fromString(String line) {
        String[] parts = line.split("\\|");
        if (parts.length < 5)
            return null;
        String img = (parts.length >= 6) ? parts[5] : "";
        String desc = (parts.length >= 7) ? parts[6] : "";
        double totalR = (parts.length >= 8) ? Double.parseDouble(parts[7]) : 0;
        int countR = (parts.length >= 9) ? Integer.parseInt(parts[8]) : 0;

        return new Car(parts[0], parts[1], parts[2], Double.parseDouble(parts[3]), Boolean.parseBoolean(parts[4]), img,
                desc, totalR, countR);
    }
}
