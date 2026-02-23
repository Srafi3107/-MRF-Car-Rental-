package service;

import model.User;
import repository.FileRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserService {
    private static final String USER_FILE = "users.txt";
    private final FileRepository fileRepository;
    private List<User> users;

    public UserService() {
        this.fileRepository = new FileRepository();
        this.users = loadUsers();
        // Seed admin if not exists
        if (users.stream().noneMatch(u -> "ADMIN".equals(u.getRole()))) {
            register(new User(UUID.randomUUID().toString(), "admin", "admin123", "ADMIN", false, false, "Admin Name",
                    "", "",
                    "admin@example.com"));
        }
    }

    private List<User> loadUsers() {
        List<String> lines = fileRepository.readAllLines(USER_FILE);
        List<User> userList = new ArrayList<>();
        for (String line : lines) {
            User user = User.fromString(line);
            if (user != null) {
                userList.add(user);
            }
        }
        return userList;
    }

    public User register(User user) {
        if (findByUsername(user.getUsername()).isPresent()) {
            return null; // Username exists
        }
        int nextId = users.size() + 1;
        user.setId("customer-" + nextId);
        users.add(user);
        saveUsers();
        return user;
    }

    public User login(String username, String password) {
        return findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }

    public Optional<User> findByUsername(String username) {
        return users.stream().filter(u -> u.getUsername().equals(username)).findFirst();
    }

    public Optional<User> findById(String id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public User forgotPassword(String username, String email) {
        Optional<User> userOpt = findByUsername(username)
                .filter(u -> u.getEmail() != null && u.getEmail().equalsIgnoreCase(email));

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordResetRequested(true);
            user.setPasswordResetApproved(false);
            saveUsers();
            return user;
        }
        return null;
    }

    public boolean approvePasswordReset(String userId) {
        Optional<User> userOpt = findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordResetApproved(true);
            saveUsers();
            return true;
        }
        return false;
    }

    public User finalizeReset(String username, String newPassword) {
        Optional<User> userOpt = findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isPasswordResetRequested() && user.isPasswordResetApproved()) {
                user.setPassword(newPassword);
                user.setPasswordResetRequested(false);
                user.setPasswordResetApproved(false);
                saveUsers();
                return user;
            }
        }
        return null;
    }

    public List<User> getResetRequests() {
        return users.stream()
                .filter(User::isPasswordResetRequested)
                .filter(u -> !u.isPasswordResetApproved())
                .collect(Collectors.toList());
    }

    public User updateUser(User updatedUser) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(updatedUser.getId())) {
                users.set(i, updatedUser);
                saveUsers();
                return updatedUser;
            }
        }
        return null;
    }

    public boolean requestPasswordReset(String userId) {
        Optional<User> userOpt = findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordResetRequested(true);
            saveUsers();
            return true;
        }
        return false;
    }

    public boolean resetPassword(String userId, String newPassword) {
        Optional<User> userOpt = findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            user.setPasswordResetRequested(false);
            saveUsers();
            return true;
        }
        return false;
    }

    public List<User> getUsersRequestingReset() {
        return users.stream().filter(u -> u.isPasswordResetRequested() && !u.isPasswordResetApproved())
                .collect(Collectors.toList());
    }

    public List<User> getAllCustomers() {
        return users.stream().filter(u -> "CUSTOMER".equals(u.getRole())).collect(Collectors.toList());
    }

    public boolean deleteUser(String id) {
        boolean removed = users.removeIf(u -> u.getId().equals(id));
        if (removed) {
            saveUsers();
        }
        return removed;
    }

    private void saveUsers() {
        List<String> lines = users.stream().map(User::toString).collect(Collectors.toList());
        fileRepository.writeAllLines(USER_FILE, lines);
    }
}
