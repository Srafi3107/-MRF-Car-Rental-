package service;

import model.User;
import repository.UserRepository;

public class UserServiceImpl implements UserService {

    private final UserRepository repo = new UserRepository();

    @Override
    public User login(String email, String password) {

        System.out.println("Checking login for: " + email);

        for (User u : repo.findAll()) {
            System.out.println("Comparing with: " + u.getEmail());

            if (u.getEmail().equals(email) && u.getPassword().equals(password)) {
                System.out.println("MATCH FOUND: " + u.getRole());
                return u;
            }
        }

        System.out.println("NO MATCH FOUND");
        return null;
    }

}
