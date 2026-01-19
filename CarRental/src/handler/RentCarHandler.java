package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.Rental;
import org.json.JSONObject;
import service.CarPriceService;
import service.RentalService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class RentCarHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        // ✅ CORS
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        try {
            // Read request body
            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

            JSONObject json = new JSONObject(body);

            String email = json.getString("email");
            String carName = json.getString("carName");
            int days = json.getInt("days");

            // ✅ IMPORTANT: CHECK IF CAR IS ALREADY RENTED
            if (RentalService.hasActiveRental(carName)) {
                String response = "CAR_ALREADY_RENTED";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                exchange.getResponseBody().write(response.getBytes());
                exchange.close();
                return;
            }

            // ✅ BACKEND PRICE CALCULATION
            int pricePerDay = CarPriceService.getPricePerDay(carName);
            int total = pricePerDay * days;

            // Create rental object
            Rental rental = new Rental(email, carName, days, total);

            // ✅ SAVE RENTAL
            RentalService.saveRental(rental);

            // Response
            JSONObject response = new JSONObject();
            response.put("message", "RENTED");
            response.put("total", total);

            byte[] resBytes = response.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, resBytes.length);
            exchange.getResponseBody().write(resBytes);
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
