package com.example.graphql;

import com.example.model.User;
import com.example.repository.UserRepository;
import com.netflix.graphql.dgs.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;

@DgsComponent
public class UserDataFetcher {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @DgsQuery
    public User user(@InputArgument String id) {
        return userRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @DgsQuery
    public User userByUsername(@InputArgument String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @DgsQuery
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    @DgsMutation
    public User createUser(@InputArgument("input") Map<String, Object> input) {
        User user = new User();
        user.setUsername((String) input.get("username"));
        user.setEmail((String) input.get("email"));
        user.setFirstName((String) input.get("firstName"));
        user.setLastName((String) input.get("lastName"));
        user.setPassword(passwordEncoder.encode((String) input.get("password")));
        user.setRole((String) input.get("role"));
        
        /*if (input.get("managerId") != null) {
            user.setManagerId(Long.parseLong((String) input.get("managerId")));
        }
        if (input.get("locationId") != null) {
            user.setLocationId(Long.parseLong((String) input.get("locationId")));
        }*/
        
        return userRepository.save(user);
    }

    @DgsMutation
    public User updateUser(@InputArgument String id, @InputArgument("input") Map<String, Object> input) {
        User user = userRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (input.get("username") != null) user.setUsername((String) input.get("username"));
        if (input.get("email") != null) user.setEmail((String) input.get("email"));
        if (input.get("firstName") != null) user.setFirstName((String) input.get("firstName"));
        if (input.get("lastName") != null) user.setLastName((String) input.get("lastName"));
        if (input.get("password") != null) user.setPassword(passwordEncoder.encode((String) input.get("password")));
        if (input.get("role") != null) user.setRole((String) input.get("role"));
        /*if (input.get("managerId") != null) user.setManagerId(Long.parseLong((String) input.get("managerId")));
        if (input.get("locationId") != null) user.setLocationId(Long.parseLong((String) input.get("locationId")));
        */
        return userRepository.save(user);
    }

    @DgsMutation
    public Boolean deleteUser(@InputArgument String id) {
        try {
            userRepository.deleteById(Long.parseLong(id));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
