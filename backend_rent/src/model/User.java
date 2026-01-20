package model;

import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String username;
    private String password;
    private String role; // "ADMIN" or "CUSTOMER"

    private boolean passwordResetRequested;
    // New fields
    private String name;
    private String phone;
    private String birthdate;
    private String email;

    public User() {
    }

    public User(String id, String username, String password, String role, boolean passwordResetRequested,
                String name, String phone, String birthdate, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.passwordResetRequested = passwordResetRequested;
        this.name = name;
        this.phone = phone;
        this.birthdate = birthdate;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isPasswordResetRequested() {
        return passwordResetRequested;
    }

    public void setPasswordResetRequested(boolean passwordResetRequested) {
        this.passwordResetRequested = passwordResetRequested;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name != null ? name.replace(",", "") : "";
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone != null ? phone.replace(",", "") : "";
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate != null ? birthdate.replace(",", "") : "";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.replace(",", "") : "";
    }

    @Override
    public String toString() {
        // Handling nulls for CSV
        String n = (name == null) ? "" : name;
        String p = (phone == null) ? "" : phone;
        String b = (birthdate == null) ? "" : birthdate;
        String e = (email == null) ? "" : email;
        return id + "|" + username + "|" + password + "|" + role + "|" + passwordResetRequested + "|" + n + "|" + p
                + "|" + b + "|" + e;
    }

    public static User fromString(String line) {
        String[] parts = line.split("\\|");
        if (parts.length < 4)
            return null;
        boolean resetRequested = false;
        if (parts.length >= 5) {
            resetRequested = Boolean.parseBoolean(parts[4]);
        }
        String n = (parts.length >= 6) ? parts[5] : "";
        String p = (parts.length >= 7) ? parts[6] : "";
        String b = (parts.length >= 8) ? parts[7] : "";
        String e = (parts.length >= 9) ? parts[8] : "";

        return new User(parts[0], parts[1], parts[2], parts[3], resetRequested, n, p, b, e);
    }
}
