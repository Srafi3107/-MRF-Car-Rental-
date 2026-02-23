package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

public class StaticFileHandler implements HttpHandler {
    private final String baseDir;

    public StaticFileHandler(String baseDir) {
        this.baseDir = baseDir;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if (!"GET".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        String path = exchange.getRequestURI().getPath();
        // Remove the context path (e.g., /images/)
        String relativePath = path.substring(path.indexOf("/", 1) + 1);
        String decodedPath = URLDecoder.decode(relativePath, StandardCharsets.UTF_8);

        File file = new File(baseDir, decodedPath);

        if (!file.exists() || file.isDirectory()) {
            String error = "File not found";
            exchange.sendResponseHeaders(404, error.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(error.getBytes());
            }
            return;
        }

        // Add Cache-Control for performance
        exchange.getResponseHeaders().set("Cache-Control", "public, max-age=3600");

        // Determine Content-Type
        String contentType = Files.probeContentType(file.toPath());
        if (contentType != null) {
            exchange.getResponseHeaders().set("Content-Type", contentType);
        }

        exchange.sendResponseHeaders(200, file.length());
        try (FileInputStream fis = new FileInputStream(file);
                OutputStream os = exchange.getResponseBody()) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = fis.read(buffer)) != -1) {
                os.write(buffer, 0, count);
            }
        }
    }
}
