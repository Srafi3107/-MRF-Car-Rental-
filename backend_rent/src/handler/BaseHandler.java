package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public abstract class BaseHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        try {
            // CORS Headers
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            System.out.println("Processing " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            handleRequest(exchange);
        } catch (Exception e) {
            e.printStackTrace();
            String error = "{\"error\":\"Internal Server Error: " + e.getMessage() + "\"}";
            byte[] bytes = error.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(500, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    protected abstract void handleRequest(HttpExchange exchange) throws IOException;

    protected void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    protected String readRequestBody(HttpExchange exchange) throws IOException {
        return new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))
                .lines().collect(Collectors.joining("\n"));
    }

    protected Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }
        return params;
    }

    // Very simple JSON parser for flat objects (no nesting)
    protected Map<String, String> parseJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.trim().isEmpty())
            return map;
        json = json.trim();
        if (json.startsWith("{"))
            json = json.substring(1);
        if (json.endsWith("}"))
            json = json.substring(0, json.length() - 1);

        int i = 0;
        while (i < json.length()) {
            // Find key
            int keyStart = json.indexOf('"', i);
            if (keyStart == -1)
                break;
            int keyEnd = json.indexOf('"', keyStart + 1);
            if (keyEnd == -1)
                break;
            String key = json.substring(keyStart + 1, keyEnd);

            // Find colon
            int colon = json.indexOf(':', keyEnd + 1);
            if (colon == -1)
                break;

            // Find value
            i = colon + 1;
            while (i < json.length() && Character.isWhitespace(json.charAt(i)))
                i++;

            if (i < json.length() && json.charAt(i) == '"') {
                // String value - handle escaped quotes
                StringBuilder val = new StringBuilder();
                i++; // skip open quote
                while (i < json.length()) {
                    char c = json.charAt(i);
                    if (c == '\\' && i + 1 < json.length() && json.charAt(i + 1) == '"') {
                        val.append('"');
                        i += 2;
                    } else if (c == '"') {
                        i++; // skip close quote
                        break;
                    } else {
                        val.append(c);
                        i++;
                    }
                }
                map.put(key, val.toString());
            } else {
                // Literal value (number, bool, null)
                int start = i;
                while (i < json.length() && json.charAt(i) != ',' && !Character.isWhitespace(json.charAt(i)))
                    i++;
                String lit = json.substring(start, i);
                map.put(key, lit.trim());
            }

            // Find next comma
            int comma = json.indexOf(',', i);
            if (comma != -1) {
                i = comma + 1;
            } else {
                break;
            }
        }
        return map;
    }
}
