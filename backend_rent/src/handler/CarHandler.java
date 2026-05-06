package handler;

import model.Car;
import service.CarService;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CarHandler extends BaseHandler {
    private final CarService carService;

    public CarHandler(CarService carService) {
        this.carService = carService;
    }

    @Override
    protected void handleRequest(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            String queryParams = exchange.getRequestURI().getQuery();
            Map<String, String> params = parseQueryParams(queryParams);
            String search = params.get("search");

            List<Car> cars;
            if (search != null && !search.isEmpty()) {
                cars = carService.searchCars(search);
            } else {
                cars = carService.getAllCars();
            }

            // Manually build JSON array
            String jsonArray = "[" + cars.stream().map(c -> carToJson(c, exchange)).collect(Collectors.joining(","))
                    + "]";
            sendResponse(exchange, 200, jsonArray);
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            Car car = new Car();
            car.setBrand(json.get("brand"));
            car.setModel(json.get("model"));
            car.setPricePerDay(Double.parseDouble(json.get("pricePerDay")));
            car.setImage(json.get("image"));
            car.setDescription(json.get("description"));
            car.setFuelType(json.get("fuelType"));
            car.setTransmission(json.get("transmission"));
            car.setSeatingCapacity(json.containsKey("seatingCapacity") ? Integer.parseInt(json.get("seatingCapacity")) : 5);
            car.setYear(json.containsKey("year") ? Integer.parseInt(json.get("year")) : 2024);
            carService.addCar(car);
            sendResponse(exchange, 201, carToJson(car, exchange));
        } else if ("PUT".equalsIgnoreCase(method)) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            Car car = new Car();
            car.setId(json.get("id"));
            car.setBrand(json.get("brand"));
            car.setModel(json.get("model"));
            car.setPricePerDay(Double.parseDouble(json.get("pricePerDay")));
            car.setAvailable(Boolean.parseBoolean(json.get("isAvailable")));
            car.setImage(json.get("image"));
            car.setDescription(json.get("description"));
            car.setFuelType(json.get("fuelType"));
            car.setTransmission(json.get("transmission"));
            car.setSeatingCapacity(json.containsKey("seatingCapacity") ? Integer.parseInt(json.get("seatingCapacity")) : 5);
            car.setYear(json.containsKey("year") ? Integer.parseInt(json.get("year")) : 2024);

            Car updated = carService.updateCar(car);
            if (updated != null) {
                sendResponse(exchange, 200, carToJson(updated, exchange));
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Car not found\"}");
            }
        } else if ("DELETE".equalsIgnoreCase(method)) {
            String query = exchange.getRequestURI().getQuery();
            Map<String, String> params = parseQueryParams(query);
            String id = params.get("id");
            if (carService.deleteCar(id)) {
                sendResponse(exchange, 200, "{\"success\":true}");
            } else {
                sendResponse(exchange, 404, "{\"error\":\"Car not found\"}");
            }
        } else {
            sendResponse(exchange, 405, "Method Not Allowed");
        }
    }

    private String carToJson(Car car, HttpExchange exchange) {
        String img = (car.getImage() == null) ? "" : car.getImage();
        String host = exchange.getRequestHeaders().getFirst("Host");
        if (host == null || host.isEmpty()) {
            host = "localhost:8080"; // Fallback
        }
        String imageUrl = "";
        if (!img.isEmpty()) {
            imageUrl = "http://" + host + "/images/" + img;
        }
        return "{\"id\":\"" + car.getId() + "\", \"brand\":\"" + car.getBrand() + "\", \"model\":\"" + car.getModel()
                + "\", \"pricePerDay\":" + car.getPricePerDay() + ", \"isAvailable\":" + car.isAvailable()
                + ", \"image\":\"" + img + "\", \"imageUrl\":\"" + imageUrl + "\", \"description\":\""
                + car.getDescription() + "\", \"averageRating\":"
                + car.getAverageRating()
                + ", \"ratingCount\":" + car.getRatingCount()
                + ", \"fuelType\":\"" + (car.getFuelType() == null ? "Petrol" : car.getFuelType()) + "\""
                + ", \"transmission\":\"" + (car.getTransmission() == null ? "Automatic" : car.getTransmission()) + "\""
                + ", \"seatingCapacity\":" + car.getSeatingCapacity()
                + ", \"year\":" + car.getYear() + "}";
    }
}
