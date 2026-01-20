package service;

import model.Booking;
import model.Car;
import repository.FileRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class BookingService {
    private static final String BOOKING_FILE = "bookings.txt";
    private final FileRepository fileRepository;
    private final CarService carService;
    private List<Booking> bookings;

    public BookingService(CarService carService) {
        this.fileRepository = new FileRepository();
        this.carService = carService;
        this.bookings = loadBookings();
    }

    private List<Booking> loadBookings() {
        List<String> lines = fileRepository.readAllLines(BOOKING_FILE);
        List<Booking> bookingList = new ArrayList<>();
        for (String line : lines) {
            Booking booking = Booking.fromString(line);
            if (booking != null) {
                bookingList.add(booking);
            }
        }
        return bookingList;
    }

    public Booking bookCar(String userId, String carId, long startDate, long endDate, String customerName,
                           String customerPhone) {
        Optional<Car> carOpt = carService.findById(carId);
        if (carOpt.isPresent()) {
            Car car = carOpt.get();
            if (car.isAvailable()) {
                // Calculate days
                long diff = endDate - startDate;
                long days = diff / (1000 * 60 * 60 * 24);
                if (days <= 0)
                    days = 1;
                double total = days * car.getPricePerDay();

                int nextId = bookings.size() + 1;
                // Initial status is PENDING. Car is NOT marked unavailable yet.
                Booking booking = new Booking("booking-" + nextId, userId, carId, startDate, endDate, total,
                        false, customerName, customerPhone, "PENDING", 0, "");
                bookings.add(booking);

                saveBookings();
                return booking;
            }
        }
        return null;
    }

    public boolean approveBooking(String bookingId) {
        Optional<Booking> bookingOpt = bookings.stream().filter(b -> b.getId().equals(bookingId)).findFirst();
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if ("PENDING".equals(booking.getStatus())) {
                booking.setStatus("APPROVED");

                // Mark car as unavailable
                Optional<Car> carOpt = carService.findById(booking.getCarId());
                if (carOpt.isPresent()) {
                    Car car = carOpt.get();
                    car.setAvailable(false);
                    carService.updateCar(car);
                }

                saveBookings();
                return true;
            }
        }
        return false;
    }

    public boolean cancelBooking(String bookingId) {
        Optional<Booking> bookingOpt = bookings.stream().filter(b -> b.getId().equals(bookingId)).findFirst();
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if ("PENDING".equals(booking.getStatus()) || "APPROVED".equals(booking.getStatus())) {
                boolean wasApproved = "APPROVED".equals(booking.getStatus());
                booking.setStatus("CANCELLED");

                if (wasApproved) {
                    // Mark car as available again
                    Optional<Car> carOpt = carService.findById(booking.getCarId());
                    if (carOpt.isPresent()) {
                        Car car = carOpt.get();
                        car.setAvailable(true);
                        carService.updateCar(car);
                    }
                }

                saveBookings();
                return true;
            }
        }
        return false;
    }

    public boolean returnCar(String bookingId) {
        Optional<Booking> bookingOpt = bookings.stream().filter(b -> b.getId().equals(bookingId)).findFirst();
        if (bookingOpt.isEmpty())
            return false;

        Booking booking = bookingOpt.get();
        if (booking.isReturned() || !"APPROVED".equals(booking.getStatus()))
            return false;

        booking.setReturned(true);
        booking.setStatus("COMPLETED");

        Optional<Car> carOpt = carService.findById(booking.getCarId());
        if (carOpt.isPresent()) {
            Car car = carOpt.get();
            car.setAvailable(true);
            carService.updateCar(car);
        }

        saveBookings();
        return true;
    }

    public boolean rateBooking(String bookingId, int rating, String feedback) {
        Optional<Booking> bookingOpt = bookings.stream().filter(b -> b.getId().equals(bookingId)).findFirst();
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if (booking.isReturned() && booking.getRating() == 0) {
                booking.setRating(rating);
                booking.setFeedback(feedback);

                // Update car rating
                Optional<Car> carOpt = carService.findById(booking.getCarId());
                if (carOpt.isPresent()) {
                    Car car = carOpt.get();
                    car.setTotalRating(car.getTotalRating() + rating);
                    car.setRatingCount(car.getRatingCount() + 1);
                    carService.updateCar(car);
                }

                saveBookings();
                return true;
            }
        }
        return false;
    }

    public List<Booking> getUserBookings(String userId) {
        return bookings.stream().filter(b -> b.getUserId().equals(userId)).collect(Collectors.toList());
    }

    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookings);
    }

    public void deleteBookingsByUserId(String userId) {
        boolean removed = bookings.removeIf(b -> b.getUserId().equals(userId));
        if (removed) {
            saveBookings();
        }
    }

    private void saveBookings() {
        List<String> lines = bookings.stream().map(Booking::toString).collect(Collectors.toList());
        fileRepository.writeAllLines(BOOKING_FILE, lines);
    }
}
