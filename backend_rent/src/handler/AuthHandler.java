package handler;

import model.User;
import service.BookingService;
import service.UserService;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;

public class AuthHandler extends BaseHandler {
    private final UserService userService;
    private final BookingService bookingService;

    public AuthHandler(UserService userService, BookingService bookingService) {
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @Override
    protected void handleRequest(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);

            if (path.endsWith("/login")) {
                handleLogin(exchange, json);
            } else if (path.endsWith("/register")) {
                handleRegister(exchange, json);
            } else if (path.endsWith("/update-profile")) {
                handleUpdateProfile(exchange, json);
            } else {
                sendResponse(exchange, 404, "Not Found");
            }
        } else if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            if (path.endsWith("/users")) {
                handleGetUsers(exchange);
            } else {
                sendResponse(exchange, 404, "Not Found");
            }
        } else if ("DELETE".equalsIgnoreCase(exchange.getRequestMethod())) {
            if (path.endsWith("/delete-user")) {
                handleDeleteUser(exchange);
            } else {
                sendResponse(exchange, 404, "Not Found");
            }
        } else {
            sendResponse(exchange, 405, "Method Not Allowed");
        }
    }

    private void handleLogin(HttpExchange exchange, Map<String, String> json) throws IOException {
        String username = json.get("username");
        String password = json.get("password");
        User user = userService.login(username, password);
        if (user != null) {
            String response = userToJson(user);
            sendResponse(exchange, 200, response);
        } else {
            sendResponse(exchange, 401, "{\"error\":\"Invalid credentials\"}");
        }
    }

    private void handleRegister(HttpExchange exchange, Map<String, String> json) throws IOException {
        User newUser = new User();
        newUser.setUsername(json.get("username"));
        newUser.setPassword(json.get("password"));
        newUser.setName(json.get("name"));
        newUser.setPhone(json.get("phone"));
        newUser.setBirthdate(json.get("birthdate"));
        newUser.setEmail(json.get("email"));
        newUser.setRole("CUSTOMER"); // Default role

        User created = userService.register(newUser);
        if (created != null) {
            sendResponse(exchange, 201, userToJson(created));
        } else {
            sendResponse(exchange, 400, "{\"error\":\"Username already exists\"}");
        }
    }

    private void handleUpdateProfile(HttpExchange exchange, Map<String, String> json) throws IOException {
        String id = json.get("id");
        java.util.Optional<User> userOpt = userService.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (json.containsKey("name"))
                user.setName(json.get("name"));
            if (json.containsKey("phone"))
                user.setPhone(json.get("phone"));
            if (json.containsKey("birthdate"))
                user.setBirthdate(json.get("birthdate"));
            if (json.containsKey("email"))
                user.setEmail(json.get("email"));

            User updated = userService.updateUser(user);
            sendResponse(exchange, 200, userToJson(updated));
        } else {
            sendResponse(exchange, 404, "{\"error\":\"User not found\"}");
        }
    }

    private void handleDeleteUser(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        Map<String, String> params = parseQueryParams(query);
        String id = params.get("id");
        if (id != null) {
            bookingService.deleteBookingsByUserId(id);
            if (userService.deleteUser(id)) {
                sendResponse(exchange, 200, "{\"success\":true}");
            } else {
                sendResponse(exchange, 404, "{\"error\":\"User not found\"}");
            }
        } else {
            sendResponse(exchange, 400, "{\"error\":\"ID parameter required\"}");
        }
    }

    private void handleGetUsers(HttpExchange exchange) throws IOException {
        // Admin only check could be here
        java.util.List<User> users = userService.getAllCustomers();
        String jsonArray = "[" + users.stream().map(this::userToJson).collect(java.util.stream.Collectors.joining(","))
                + "]";
        sendResponse(exchange, 200, jsonArray);
    }

    private String userToJson(User user) {
        String n = (user.getName() == null) ? "" : user.getName();
        String p = (user.getPhone() == null) ? "" : user.getPhone();
        String b = (user.getBirthdate() == null) ? "" : user.getBirthdate();
        String e = (user.getEmail() == null) ? "" : user.getEmail();

        return "{\"id\":\"" + user.getId() + "\", \"username\":\"" + user.getUsername()
                + "\", \"role\":\"" + user.getRole() + "\", \"passwordResetRequested\":"
                + user.isPasswordResetRequested()
                + ", \"name\":\"" + n + "\", \"phone\":\"" + p
                + "\", \"birthdate\":\"" + b + "\", \"email\":\"" + e + "\"}";
    }
}
