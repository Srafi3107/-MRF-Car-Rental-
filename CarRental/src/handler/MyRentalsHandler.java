package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.Rental;
import service.RentalService;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;

public class MyRentalsHandler implements HttpHandler {


    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            // ✅ Add CORS headers so frontend can access
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            // ✅ Handle OPTIONS preflight request
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // No content
                exchange.close();
                return;
            }

            // Extract email from query
            String query = exchange.getRequestURI().getQuery(); // email=alice@car.com
            String email = query.split("=")[1];

            // Debug: print all rentals
            List<Rental> allRentals = RentalService.getAllRentals();
            System.out.println("All rentals in system:");
            for (Rental r : allRentals) {
                System.out.println(r.getCustomerEmail() + " | " + r.getCarName());
            }

            // Filter rentals by customer
            List<Rental> rentals = RentalService.getRentalsByCustomer(email);

            // Convert to JSON array
            JSONArray jsonArray = new JSONArray();
            for (Rental r : rentals) {
                JSONObject obj = new JSONObject();
                obj.put("carName", r.getCarName());
                obj.put("days", r.getDays());
                obj.put("total", r.getTotal());
                obj.put("status", r.getStatus());
                obj.put("email", r.getCustomerEmail());
                jsonArray.put(obj);
            }
            System.out.println("Response JSON: " + jsonArray.toString());

            // Send JSON response
            String response = jsonArray.toString();
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            exchange.getResponseBody().write(response.getBytes());
            exchange.close();

        } catch (Exception e) {
            e.printStackTrace();
            String response = "SERVER ERROR";
            exchange.sendResponseHeaders(500, response.getBytes().length);
            exchange.getResponseBody().write(response.getBytes());
            exchange.close();
        }
    }

}
