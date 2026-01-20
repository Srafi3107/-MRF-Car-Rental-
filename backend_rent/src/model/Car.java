package model;

import java.io.Serializable;

public class Car implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String brand;
    private String model;
    private double pricePerDay;
    private boolean isAvailable;
    private String imageBase64;
    private double totalRating;
    private int ratingCount;

    public Car() {
    }

    public Car(String id, String brand, String model, double pricePerDay, boolean isAvailable, String imageBase64,
               double totalRating, int ratingCount) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.pricePerDay = pricePerDay;
        this.isAvailable = isAvailable;
        this.imageBase64 = imageBase64;
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

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
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
        String img = (imageBase64 == null) ? "" : imageBase64;
        return id + "|" + brand + "|" + model + "|" + pricePerDay + "|" + isAvailable + "|" + img + "|" + totalRating
                + "|" + ratingCount;
    }

    public static Car fromString(String line) {
        String[] parts = line.split("\\|");
        if (parts.length < 5)
            return null;
        String img = "";
        if (parts.length >= 6) {
            img = parts[5];
        }
        double totalR = (parts.length >= 7) ? Double.parseDouble(parts[6]) : 0;
        int countR = (parts.length >= 8) ? Integer.parseInt(parts[7]) : 0;

        return new Car(parts[0], parts[1], parts[2], Double.parseDouble(parts[3]), Boolean.parseBoolean(parts[4]), img,
                totalR, countR);
    }
}
