package service;

import model.Rental;
import org.json.JSONArray;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

public class RentalService {

    private static final String FILE = "rentals.json";

    // Save rental to JSON array
    public static void saveRental(Rental rental) throws IOException {
        File file = new File(FILE);
        JSONArray rentals;

        // Read existing JSON array or start new
        if (file.exists() && file.length() > 0) {
            String content = new String(Files.readAllBytes(file.toPath()));
            if (content.trim().startsWith("[")) {
                rentals = new JSONArray(content);
            } else {
                rentals = new JSONArray();
            }
        } else {
            rentals = new JSONArray();
        }

        // ✅ Check if the rental already exists (same customer + same car + ACTIVE)
        boolean exists = false;
        for (int i = 0; i < rentals.length(); i++) {
            JSONObject obj = rentals.getJSONObject(i);
            if (obj.getString("email").equalsIgnoreCase(rental.getCustomerEmail()) &&
                    obj.getString("carName").equalsIgnoreCase(rental.getCarName()) &&
                    obj.getString("status").equalsIgnoreCase("ACTIVE")) {
                exists = true;
                break;
            }
        }

        if (exists) {
            System.out.println("Rental already exists for " + rental.getCustomerEmail() + " and car " + rental.getCarName());
            return; // do not add duplicate
        }

        // Add new rental
        JSONObject obj = new JSONObject();
        obj.put("email", rental.getCustomerEmail());
        obj.put("carName", rental.getCarName());
        obj.put("days", rental.getDays());
        obj.put("total", rental.getTotal());
        obj.put("status", rental.getStatus());

        rentals.put(obj);

        // Save back to file
        Files.write(file.toPath(), rentals.toString(4).getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }
    // service/RentalService.java
    public static boolean hasActiveRental(String carName) throws IOException {
        List<Rental> allRentals = getAllRentals(); // read from file
        for (Rental r : allRentals) {
            if (r.getCarName().equalsIgnoreCase(carName) && "ACTIVE".equalsIgnoreCase(r.getStatus())) {
                return true;
            }
        }
        return false;
    }

    // Get all rentals
    public static List<Rental> getAllRentals() throws IOException {
        List<Rental> list = new ArrayList<>();
        File file = new File(FILE);
        if (!file.exists() || file.length() == 0) return list;

        String content = new String(Files.readAllBytes(file.toPath()));
        JSONArray rentals = new JSONArray(content);

        for (int i = 0; i < rentals.length(); i++) {
            JSONObject obj = rentals.getJSONObject(i);
            list.add(new Rental(
                    obj.getString("email"),
                    obj.getString("carName"),
                    obj.getInt("days"),
                    obj.getInt("total")
            ));
        }
        return list;
    }

    public static boolean completeRental(String email, String carName) throws IOException {
        File file = new File(FILE);
        if (!file.exists() || file.length() == 0) return false;

        String content = new String(Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);
        JSONArray rentals = new JSONArray(content);

        boolean updated = false;

        for (int i = 0; i < rentals.length(); i++) {
            JSONObject obj = rentals.getJSONObject(i);
            if (obj.getString("email").equalsIgnoreCase(email) &&
                    obj.getString("carName").equalsIgnoreCase(carName) &&
                    obj.getString("status").equalsIgnoreCase("ACTIVE")) {

                obj.put("status", "COMPLETED");
                updated = true;
                break; // stop after first match
            }
        }

        // Save back
        if (updated) {
            Files.write(file.toPath(), rentals.toString(4).getBytes(StandardCharsets.UTF_8));
        }

        return updated;
    }
    public static JSONArray loadAllRentals() throws IOException {
        File file = new File("rentals.json");
        if (!file.exists() || file.length() == 0) return new JSONArray();

        String content = new String(Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);
        return new JSONArray(content);
    }

    // Get rentals for a customer
    public static List<Rental> getRentalsByCustomer(String email) throws IOException {
        List<Rental> all = getAllRentals();
        List<Rental> customerRentals = new ArrayList<>();
        for (Rental r : all) {
            if (r.getCustomerEmail().equalsIgnoreCase(email)) {
                customerRentals.add(r);
            }
        }
        return customerRentals;
    }
}
