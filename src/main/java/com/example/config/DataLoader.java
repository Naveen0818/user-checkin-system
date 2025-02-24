package com.example.config;

import com.example.service.DataLoaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    @Autowired
    private DataLoaderService dataLoaderService;

    @Override
    public void run(String... args) {
        dataLoaderService.loadSampleData();
    }
}
