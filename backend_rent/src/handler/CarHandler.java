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
            String jsonArray = "[" + cars.stream().map(this::carToJson).collect(Collectors.joining(",")) + "]";
            sendResponse(exchange, 200, jsonArray);
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            Car car = new Car();
            car.setBrand(json.get("brand"));
            car.setModel(json.get("model"));
            car.setPricePerDay(Double.parseDouble(json.get("pricePerDay")));
            car.setImageBase64(json.get("imageBase64"));
            carService.addCar(car);
            sendResponse(exchange, 201, carToJson(car));
        } else if ("PUT".equalsIgnoreCase(method)) {
            String body = readRequestBody(exchange);
            Map<String, String> json = parseJson(body);
            Car car = new Car();
            car.setId(json.get("id"));
            car.setBrand(json.get("brand"));
            car.setModel(json.get("model"));
            car.setPricePerDay(Double.parseDouble(json.get("pricePerDay")));
            car.setAvailable(Boolean.parseBoolean(json.get("isAvailable")));
            car.setImageBase64(json.get("imageBase64"));

            Car updated = carService.updateCar(car);
            if (updated != null) {
                sendResponse(exchange, 200, carToJson(updated));
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

    private String carToJson(Car car) {
        String img = (car.getImageBase64() == null) ? "" : car.getImageBase64();
        return "{\"id\":\"" + car.getId() + "\", \"brand\":\"" + car.getBrand() + "\", \"model\":\"" + car.getModel()
                + "\", \"pricePerDay\":" + car.getPricePerDay() + ", \"isAvailable\":" + car.isAvailable()
                + ", \"imageBase64\":\"" + img + "\", \"averageRating\":" + car.getAverageRating()
                + ", \"ratingCount\":" + car.getRatingCount() + "}";
    }
}
