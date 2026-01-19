package service;

import java.util.HashMap;
import java.util.Map;

public class CarPriceService {

    private static final Map<String, Integer> prices = new HashMap<>();

    static {
        prices.put("Toyota Corolla", 1000);
        prices.put("Hyundai Creta", 1500);
        prices.put("Maruti Swift", 800);
    }

    public static int getPricePerDay(String carName) {
        return prices.getOrDefault(carName, 1000);
    }
}
