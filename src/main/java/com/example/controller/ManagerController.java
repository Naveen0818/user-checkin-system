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

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        User manager = userRepository.findByUsername(request.get("managerUsername"))
            .orElseThrow(() -> new RuntimeException("Manager not found"));
            
        Location location = locationRepository.findByName(request.get("locationName"));
        if (location == null) {
            throw new RuntimeException("Location not found");
        }

        User newUser = new User();
        newUser.setUsername(request.get("username"));
        newUser.setPassword(request.get("password")); // Note: Should be encoded
        newUser.setManager(manager);
        newUser.setLocation(location);
        newUser.setRole(UserRole.USER);
        
        userRepository.save(newUser);
        return ResponseEntity.ok().body("User created successfully");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getManagedUsers(@RequestParam String managerUsername) {
        User manager = userRepository.findByUsername(managerUsername)
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        return ResponseEntity.ok(manager.getManagedUsers());
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
