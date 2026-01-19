package model;

public class Rental {
    private String customerEmail;
    private String carName;
    private int days;
    private int total;
    private String status;

    public Rental(String customerEmail, String carName, int days, int total) {
        this.customerEmail = customerEmail;
        this.carName = carName;
        this.days = days;
        this.total = total;
        this.status = "ACTIVE";
    }

    public String getCustomerEmail() { return customerEmail; }
    public String getCarName() { return carName; }
    public int getDays() { return days; }
    public int getTotal() { return total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
