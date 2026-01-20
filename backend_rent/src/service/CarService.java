package service;

import model.Car;
import repository.FileRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class CarService {
    private static final String CAR_FILE = "cars.txt";
    private final FileRepository fileRepository;
    private List<Car> cars;

    public CarService() {
        this.fileRepository = new FileRepository();
        this.cars = loadCars();
    }

    private List<Car> loadCars() {
        List<String> lines = fileRepository.readAllLines(CAR_FILE);
        List<Car> carList = new ArrayList<>();
        for (String line : lines) {
            Car car = Car.fromString(line);
            if (car != null) {
                carList.add(car);
            }
        }
        return carList;
    }

    public List<Car> getAllCars() {
        return new ArrayList<>(cars);
    }

    public Car addCar(Car car) {
        int nextId = cars.size() + 1;
        car.setId("car-" + nextId);
        car.setAvailable(true); // Default to available
        cars.add(car);
        saveCars();
        return car;
    }

    public boolean deleteCar(String id) {
        boolean removed = cars.removeIf(c -> c.getId().equals(id));
        if (removed) {
            saveCars();
        }
        return removed;
    }

    public Car updateCar(Car updatedCar) {
        for (int i = 0; i < cars.size(); i++) {
            if (cars.get(i).getId().equals(updatedCar.getId())) {
                cars.set(i, updatedCar);
                saveCars();
                return updatedCar;
            }
        }
        return null;
    }

    public Optional<Car> findById(String id) {
        return cars.stream().filter(c -> c.getId().equals(id)).findFirst();
    }

    public List<Car> searchCars(String query) {
        if (query == null || query.isEmpty()) {
            return getAllCars();
        }
        String lowerQuery = query.toLowerCase();
        return cars.stream()
                .filter(c -> c.getBrand().toLowerCase().contains(lowerQuery) ||
                        c.getModel().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    private void saveCars() {
        List<String> lines = cars.stream().map(Car::toString).collect(Collectors.toList());
        fileRepository.writeAllLines(CAR_FILE, lines);
    }
}
