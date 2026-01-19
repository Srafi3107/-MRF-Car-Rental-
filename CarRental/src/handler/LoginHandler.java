package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.User;
import service.UserService;
import service.UserServiceImpl;

import java.io.*;
import java.nio.charset.StandardCharsets;

public class LoginHandler implements HttpHandler {

    private final UserService userService = new UserServiceImpl();

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        // ---- CORS ----
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        // ---- READ REQUEST BODY ----
        InputStream is = exchange.getRequestBody();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        String body = sb.toString();
        System.out.println("Request body: " + body);

        // ---- PARSE JSON MANUALLY (NO GSON) ----
        String email;
        String password;

        try {
            email = body.split("\"email\":\"")[1].split("\"")[0].trim();
            password = body.split("\"password\":\"")[1].split("\"")[0].trim();
        } catch (Exception e) {
            String error = "{\"message\":\"Invalid request format\"}";
            exchange.sendResponseHeaders(400, error.length());
            exchange.getResponseBody().write(error.getBytes());
            exchange.close();
            return;
        }

        System.out.println("Email: " + email);
        System.out.println("Password: " + password);

        // ---- AUTHENTICATION ----
        User user = userService.login(email, password);

        if (user == null) {
            String error = "{\"message\":\"Invalid credentials\"}";
            exchange.sendResponseHeaders(401, error.length());
            exchange.getResponseBody().write(error.getBytes());
            exchange.close();
            return;
        }

        // ---- SUCCESS RESPONSE ----
        String response = "{"
                + "\"id\":" + user.getId() + ","
                + "\"username\":\"" + user.getUsername() + "\","
                + "\"email\":\"" + user.getEmail() + "\","
                + "\"role\":\"" + user.getRole() + "\""
                + "}";


        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, response.getBytes().length);
        exchange.getResponseBody().write(response.getBytes());
        exchange.close();
    }
}
