package com.javabackend.marketplace.service;
 import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.javabackend.marketplace.config.JwtUtil;
import com.javabackend.marketplace.dto.LoginRequest;
import com.javabackend.marketplace.dto.LoginResponse;
import com.javabackend.marketplace.model.User;
import com.javabackend.marketplace.repository.UserRepository;



@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(User user) {

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Admin cannot register");
        }

        // 1. Check duplicate email
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists");
        }

        // 2. Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        // 3. Hide password in response
        savedUser.setPassword(null);

        return savedUser;
    }


   public String loginUser(LoginRequest loginRequest) {

    User user = userRepository.findByEmail(loginRequest.getEmail());

    if (user == null) {
        throw new IllegalArgumentException("Invalid email or password");
    }
    
    if (user.isBanned()) {
        throw new IllegalArgumentException("Account is banned");
    }

    if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        throw new IllegalArgumentException("Invalid email or password");
    }

    return jwtUtil.generateToken(
        user.getId(),
        user.getRole(),
        user.getCity(),
        user.getCollege()
    );
}




}
