package com.example.controller;

import com.example.model.*;
import com.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsersForManager(@RequestParam Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        List<User> users = userRepository.findByManager(manager);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user, @RequestParam Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        user.setManager(manager);
        user.setRole(UserRole.USER.name());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/team")
    public ResponseEntity<List<User>> getTeam(@RequestParam Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        List<User> team = userRepository.findByManager(manager);
        return ResponseEntity.ok(team);
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        eventRepository.save(event);
        return ResponseEntity.ok().body("Event created successfully");
    }

    @GetMapping("/events/location/{locationId}")
    public ResponseEntity<List<Event>> getEventsByLocation(@PathVariable Long locationId) {
        Location location = locationRepository.findById(locationId)
            .orElseThrow(() -> new RuntimeException("Location not found"));
        return ResponseEntity.ok(eventRepository.findByLocation(location));
    }

    @PostMapping("/locations")
    public ResponseEntity<?> createLocation(@RequestBody Location location) {
        locationRepository.save(location);
        return ResponseEntity.ok().body("Location created successfully");
    }
}
