package com.example.repository;

import com.example.model.Event;
import com.example.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByLocation(Location location);
    List<Event> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
}
