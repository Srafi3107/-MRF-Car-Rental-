package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;
import org.json.JSONObject;
import service.RentalService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

public class CompleteRentalHandler implements HttpHandler {

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
            InputStream is = exchange.getRequestBody();
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            JSONObject json = new JSONObject(body);

            String email = json.getString("email");
            String carName = json.getString("carName");

            // Load all rentals
            JSONArray rentals = RentalService.loadAllRentals(); // method returns JSONArray from rentals.json

            boolean updated = false;
            for (int i = 0; i < rentals.length(); i++) {
                JSONObject r = rentals.getJSONObject(i);
                if (r.getString("email").equals(email) &&
                        r.getString("carName").equals(carName) &&
                        r.getString("status").equals("ACTIVE")) {

                    r.put("status", "COMPLETED");
                    updated = true;
                    break;
                }
            }

            if (updated) {
                Files.write(Paths.get("rentals.json"), rentals.toString(4).getBytes(StandardCharsets.UTF_8));
            }

            // Response
            JSONObject response = new JSONObject();
            response.put("message", updated ? "COMPLETED" : "NOT_FOUND");

            byte[] resBytes = response.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, resBytes.length);
            exchange.getResponseBody().write(resBytes);
            exchange.close();

        } catch (Exception e) {
            e.printStackTrace();
            String response = "SERVER ERROR";
            exchange.sendResponseHeaders(500, response.getBytes(StandardCharsets.UTF_8).length);
            exchange.getResponseBody().write(response.getBytes(StandardCharsets.UTF_8));
            exchange.close();
        }
    }
}
