package com.example.service;

import com.example.model.Location;
import com.example.model.User;
import com.example.repository.LocationRepository;
import com.example.repository.UserRepository;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Service
public class DataLoaderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Faker faker = new Faker(new Locale("en-US"));
    private final Random random = new Random();

    @Transactional
    public void loadSampleData() {
        // Create locations
        List<Location> locations = createLocations();

        // Create hierarchy
        User ceo = createCEO();
        List<User> executives = createExecutives(ceo);
        List<User> managers = createManagers(executives);
        createEmployees(managers, locations);

        System.out.println("Sample data loaded successfully!");
    }

    private List<Location> createLocations() {
        List<Location> locations = new ArrayList<>();
        String[] cities = {"New York", "San Francisco", "Chicago", "Los Angeles", "Boston"};
        
        for (String city : cities) {
            Location location = new Location();
            location.setName(city + " Office");
            location.setAddress(faker.address().fullAddress());
            locations.add(locationRepository.save(location));
        }
        return locations;
    }

    private User createCEO() {
        User ceo = new User();
        ceo.setUsername("ceo");
        ceo.setPassword(passwordEncoder.encode("password"));
        ceo.setFirstName(faker.name().firstName());
        ceo.setLastName(faker.name().lastName());
        ceo.setEmail("ceo@company.com");
        ceo.setRole("EXECUTIVE");
        return userRepository.save(ceo);
    }

    private List<User> createExecutives(User ceo) {
        List<User> executives = new ArrayList<>();
        
        for (int i = 1; i <= 2; i++) {
            User executive = new User();
            executive.setUsername("exec" + i);
            executive.setPassword(passwordEncoder.encode("password"));
            executive.setFirstName(faker.name().firstName());
            executive.setLastName(faker.name().lastName());
            executive.setEmail("exec" + i + "@company.com");
            executive.setRole("EXECUTIVE");
            executive.setManager(ceo);
            executives.add(userRepository.save(executive));
        }
        return executives;
    }

    private List<User> createManagers(List<User> executives) {
        List<User> managers = new ArrayList<>();
        
        for (int i = 1; i <= 10; i++) {
            User manager = new User();
            manager.setUsername("manager" + i);
            manager.setPassword(passwordEncoder.encode("password"));
            manager.setFirstName(faker.name().firstName());
            manager.setLastName(faker.name().lastName());
            manager.setEmail("manager" + i + "@company.com");
            manager.setRole("MANAGER");
            // Assign to one of the executives randomly
            manager.setManager(executives.get(random.nextInt(executives.size())));
            managers.add(userRepository.save(manager));
        }
        return managers;
    }

    private void createEmployees(List<User> managers, List<Location> locations) {
        int employeeCount = 1;
        
        for (User manager : managers) {
            // Create 20 employees for each manager
            for (int i = 1; i <= 20; i++) {
                User employee = new User();
                employee.setUsername("emp" + employeeCount);
                employee.setPassword(passwordEncoder.encode("password"));
                employee.setFirstName(faker.name().firstName());
                employee.setLastName(faker.name().lastName());
                employee.setEmail("emp" + employeeCount + "@company.com");
                employee.setRole("USER");
                employee.setManager(manager);
                // Assign random location
                employee.setLocation(locations.get(random.nextInt(locations.size())));
                userRepository.save(employee);
                employeeCount++;
            }
        }
    }
}
