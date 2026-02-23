import handler.AuthHandler;
import handler.BookingHandler;
import handler.CarHandler;
import handler.ImageUploadHandler;
import service.BookingService;
import service.CarService;
import service.UserService;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {

        // ✅ Get port from environment (required for Render/Railway)
        String portStr = System.getenv("PORT");
        int port = (portStr != null) ? Integer.parseInt(portStr) : 8080;

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        // Core Services
        UserService userService = new UserService();
        CarService carService = new CarService();
        BookingService bookingService = new BookingService(carService);

        // API Contexts
        AuthHandler authHandler = new AuthHandler(userService, bookingService);
        server.createContext("/auth/login", authHandler);
        server.createContext("/auth/register", authHandler);
        server.createContext("/auth/update-profile", authHandler);
        server.createContext("/auth/forgot-password", authHandler);
        server.createContext("/auth/reset-status", authHandler);
        server.createContext("/auth/approve-reset", authHandler);
        server.createContext("/auth/finalize-reset", authHandler);
        server.createContext("/auth/delete-user", authHandler);
        server.createContext("/auth/users", authHandler);

        server.createContext("/cars", new CarHandler(carService));
        server.createContext("/bookings", new BookingHandler(bookingService));
        server.createContext("/images", new ImageUploadHandler());

        server.setExecutor(null); // Default executor
        System.out.println("🚀 Server started on port " + port);
        server.start();
    }
}
