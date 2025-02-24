package com.example.controller;

import com.example.model.Checkin;
import com.example.model.User;
import com.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok().body(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .<Object>map(user -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Login successful");
                    response.put("username", user.getUsername());
                    return response;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Invalid credentials"));
    }

    @PostMapping("/checkin")
    public ResponseEntity<String> userCheckin(@RequestBody Map<String, String> checkinRequest) {
        String username = checkinRequest.get("username");
        
        return userRepository.findByUsername(username)
                .map(user -> {
                    Checkin checkin = new Checkin();
                    checkin.setUser(user);
                    checkin.setCheckinTime(LocalDateTime.now());
                    user.getCheckins().add(checkin);
                    userRepository.save(user);
                    return ResponseEntity.ok("Checkin successful");
                })
                .orElse(ResponseEntity.badRequest().body("User not found"));
    }
}
