package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.UUID;

/**
 * Handles POST /images/upload — accepts raw bytes in body with filename in
 * the query param ?filename=car.jpg, saves to "Car pics" directory.
 * Also handles GET /images/* (delegates to static file serving).
 */
public class ImageUploadHandler implements HttpHandler {
    private static final String BASE_DIR = "Car pics";

    public ImageUploadHandler() {
        // Ensure the directory exists
        new File(BASE_DIR).mkdirs();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String uri = exchange.getRequestURI().toString();
        System.out.println(">>> [" + method + "] " + uri);

        // Essential: Set CORS headers before ANYTHING else
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With, Accept");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "3600");

        String path = exchange.getRequestURI().getPath();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if ("POST".equalsIgnoreCase(method) && path.endsWith("/upload")) {
            handleUpload(exchange);
        } else if ("GET".equalsIgnoreCase(method)) {
            handleGetImage(exchange);
        } else {
            exchange.sendResponseHeaders(405, -1);
        }
    }

    private void handleUpload(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        String originalName = "upload.jpg";
        if (query != null) {
            for (String param : query.split("&")) {
                if (param.startsWith("filename=")) {
                    originalName = java.net.URLDecoder.decode(param.substring(9), StandardCharsets.UTF_8);
                }
            }
        }

        // Generate unique filename to avoid collisions
        String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : ".jpg";
        String uniqueName = UUID.randomUUID().toString().replace("-", "").substring(0, 8) + ext;

        File outFile = new File(BASE_DIR, uniqueName);
        try (InputStream is = exchange.getRequestBody();
                FileOutputStream fos = new FileOutputStream(outFile)) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = is.read(buf)) != -1) {
                fos.write(buf, 0, n);
            }
        }

        String host = exchange.getRequestHeaders().getFirst("Host");
        String imageUrl = "http://" + host + "/images/" + uniqueName;
        String json = "{\"filename\":\"" + uniqueName + "\", \"imageUrl\":\"" + imageUrl + "\"}";

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private void handleGetImage(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String relative = path.replaceFirst("^/images/?", "");
        String decoded = java.net.URLDecoder.decode(relative, StandardCharsets.UTF_8);
        File file = new File(BASE_DIR, decoded);

        if (!file.exists() || file.isDirectory()) {
            byte[] err = "File not found".getBytes();
            exchange.sendResponseHeaders(404, err.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(err);
            }
            return;
        }

        String contentType = Files.probeContentType(file.toPath());
        if (contentType != null)
            exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Cache-Control", "public, max-age=3600");
        exchange.sendResponseHeaders(200, file.length());

        try (FileInputStream fis = new FileInputStream(file);
                OutputStream os = exchange.getResponseBody()) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = fis.read(buf)) != -1)
                os.write(buf, 0, n);
        }
    }
}
