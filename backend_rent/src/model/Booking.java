package model;

import java.io.Serializable;

public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String userId;
    private String carId;
    private long startDate; // Epoch millis
    private long endDate; // Epoch millis
    private double totalPrice;
    private boolean isReturned;

    // New fields
    private String customerName;
    private String customerPhone;
    private String status; // PENDING, APPROVED, CANCELLED, COMPLETED
    private int rating; // 1-5
    private String feedback;

    public Booking() {
    }

    public Booking(String id, String userId, String carId, long startDate, long endDate, double totalPrice,
                   boolean isReturned, String customerName, String customerPhone, String status, int rating, String feedback) {
        this.id = id;
        this.userId = userId;
        this.carId = carId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalPrice = totalPrice;
        this.isReturned = isReturned;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.status = status;
        this.rating = rating;
        this.feedback = feedback;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCarId() {
        return carId;
    }

    public void setCarId(String carId) {
        this.carId = carId;
    }

    public long getStartDate() {
        return startDate;
    }

    public void setStartDate(long startDate) {
        this.startDate = startDate;
    }

    public long getEndDate() {
        return endDate;
    }

    public void setEndDate(long endDate) {
        this.endDate = endDate;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public boolean isReturned() {
        return isReturned;
    }

    public void setReturned(boolean returned) {
        isReturned = returned;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    @Override
    public String toString() {
        String n = (customerName == null) ? "" : customerName;
        String p = (customerPhone == null) ? "" : customerPhone;
        String s = (status == null) ? "PENDING" : status;
        String f = (feedback == null) ? "" : feedback;
        return id + "|" + userId + "|" + carId + "|" + startDate + "|" + endDate + "|" + totalPrice + "|" + isReturned
                + "|" + n + "|" + p + "|" + s + "|" + rating + "|" + f;
    }

    public static Booking fromString(String line) {
        String[] parts = line.split("\\|");
        if (parts.length < 7)
            return null;

        String n = (parts.length >= 8) ? parts[7] : "";
        String p = (parts.length >= 9) ? parts[8] : "";
        String s = (parts.length >= 10) ? parts[9] : "PENDING";
        int r = (parts.length >= 11) ? Integer.parseInt(parts[10]) : 0;
        String f = (parts.length >= 12) ? parts[11] : "";

        return new Booking(parts[0], parts[1], parts[2], Long.parseLong(parts[3]), Long.parseLong(parts[4]),
                Double.parseDouble(parts[5]), Boolean.parseBoolean(parts[6]), n, p, s, r, f);
    }
}
