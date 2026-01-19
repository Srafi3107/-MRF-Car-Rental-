package service;

import model.User;

public interface UserService {
    User login(String email, String password);
}
