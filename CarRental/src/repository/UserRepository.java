package repository;

import model.User;
import java.util.ArrayList;
import java.util.List;

public class UserRepository {

    private final List<User> users = new ArrayList<>();

    public UserRepository() {
        users.add(new User(1, "Admin", "admin@car.com", "admin123", "ADMIN"));
        users.add(new User(2, "Alice", "alice@car.com", "alice123", "CUSTOMER"));
    }

    public List<User> findAll() {
        return users;
    }
}
