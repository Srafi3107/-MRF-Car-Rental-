package handler;

import model.Booking;
import service.BookingService;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BookingHandler extends BaseHandler {
    private final BookingService bookingService;

    public BookingHandler(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Override
    protected void handleRequest(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        if ("POST".equalsIgnoreCase(method) && path.endsWith("/book")) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            String userId = json.get("userId");
            String carId = json.get("carId");
            long startDate = Long.parseLong(json.get("startDate"));
            long endDate = Long.parseLong(json.get("endDate"));
            String name = json.get("customerName");
            String phone = json.get("customerPhone");

            Booking booking = bookingService.bookCar(userId, carId, startDate, endDate, name, phone);
            if (booking != null) {
                sendResponse(exchange, 200, bookingToJson(booking));
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Car unavailable or invalid\"}");
            }
        } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/approve")) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            String bookingId = json.get("bookingId");
            if (bookingService.approveBooking(bookingId)) {
                sendResponse(exchange, 200, "{\"success\":true}");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Approval failed\"}");
            }
        } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/cancel")) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            String bookingId = json.get("bookingId");
            if (bookingService.cancelBooking(bookingId)) {
                sendResponse(exchange, 200, "{\"success\":true}");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Cancellation failed\"}");
            }
        } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/rate")) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            String bookingId = json.get("bookingId");
            int rating = Integer.parseInt(json.get("rating"));
            String feedback = json.get("feedback");
            if (bookingService.rateBooking(bookingId, rating, feedback)) {
                sendResponse(exchange, 200, "{\"success\":true}");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Rating failed\"}");
            }
        } else if ("POST".equalsIgnoreCase(method) && path.endsWith("/return")) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            String bookingId = json.get("bookingId");
            if (bookingService.returnCar(bookingId)) {
                sendResponse(exchange, 200, "{\"success\":true}");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Return failed\"}");
            }
        } else if ("GET".equalsIgnoreCase(method)) {
            String query = exchange.getRequestURI().getQuery();
            Map<String, String> params = parseQueryParams(query);
            String userId = params.get("userId");

            List<Booking> bookings;
            if (userId != null) {
                bookings = bookingService.getUserBookings(userId);
            } else {
                // Admin gets all (simplified)
                bookings = bookingService.getAllBookings();
            }
            String jsonArray = "[" + bookings.stream().map(this::bookingToJson).collect(Collectors.joining(",")) + "]";
            sendResponse(exchange, 200, jsonArray);
        }
    }

    private String bookingToJson(Booking b) {
        String n = b.getCustomerName() == null ? "" : b.getCustomerName();
        String p = b.getCustomerPhone() == null ? "" : b.getCustomerPhone();
        String s = b.getStatus() == null ? "PENDING" : b.getStatus();
        String f = b.getFeedback() == null ? "" : b.getFeedback().replace("\"", "\\\"");
        return "{\"id\":\"" + b.getId() + "\", \"userId\":\"" + b.getUserId() + "\", \"carId\":\"" + b.getCarId()
                + "\", \"startDate\":" + b.getStartDate() + ", \"endDate\":" + b.getEndDate() + ", \"totalPrice\":"
                + b.getTotalPrice() + ", \"isReturned\":" + b.isReturned()
                + ", \"customerName\":\"" + n + "\", \"customerPhone\":\"" + p + "\", \"status\":\"" + s
                + "\", \"rating\":" + b.getRating() + ", \"feedback\":\"" + f + "\"}";
    }
}
