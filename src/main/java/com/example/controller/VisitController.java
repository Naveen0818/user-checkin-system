package com.example.controller;

import com.example.model.*;
import com.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/visits")
public class VisitController {
    
    @Autowired
    private CheckinRepository checkinRepository;
    
    @Autowired
    private PlannedVisitRepository plannedVisitRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats/monthly")
    public ResponseEntity<?> getMonthlyCheckinStats(
            @RequestParam String username,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // If startDate is not provided, use 6 months ago
        LocalDateTime start = startDate != null ? startDate : 
            LocalDateTime.now().minusMonths(6).withDayOfMonth(1).withHour(0).withMinute(0);
        LocalDateTime end = LocalDateTime.now();

        List<Object[]> monthlyStats = checkinRepository.getMonthlyCheckinStats(user, start, end);
        
        List<Map<String, Object>> response = monthlyStats.stream()
            .map(stat -> {
                Map<String, Object> monthStat = new HashMap<>();
                int month = ((Number) stat[0]).intValue();
                long count = ((Number) stat[1]).longValue();
                YearMonth ym = YearMonth.now().withMonth(month);
                
                monthStat.put("month", month);
                monthStat.put("monthName", ym.getMonth().toString());
                monthStat.put("count", count);
                monthStat.put("startDate", ym.atDay(1).atStartOfDay());
                monthStat.put("endDate", ym.atEndOfMonth().atTime(23, 59, 59));
                
                return monthStat;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/plan")
    public ResponseEntity<?> planVisit(@RequestBody PlannedVisit visit) {
        plannedVisitRepository.save(visit);
        return ResponseEntity.ok().body("Visit planned successfully");
    }

    @GetMapping("/planned")
    public ResponseEntity<?> getPlannedVisits(
            @RequestParam String username,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now();
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now().plusMonths(6);

        List<PlannedVisit> visits = plannedVisitRepository
            .findByUserAndPlannedTimeBetweenOrderByPlannedTimeAsc(user, start, end);

        return ResponseEntity.ok(visits);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/planned")
    public ResponseEntity<?> getManagersUsersPlannedVisits(
            @RequestParam String managerUsername,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
        
        User manager = userRepository.findByUsername(managerUsername)
            .orElseThrow(() -> new RuntimeException("Manager not found"));

        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now();

        List<PlannedVisit> visits = plannedVisitRepository
            .findFutureVisitsForManagersUsers(manager, start);

        return ResponseEntity.ok(visits);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/checkins")
    public ResponseEntity<?> getManagersUsersCheckins(
            @RequestParam String managerUsername,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        User manager = userRepository.findByUsername(managerUsername)
            .orElseThrow(() -> new RuntimeException("Manager not found"));

        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusMonths(6);
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();

        List<Checkin> checkins = checkinRepository
            .findCheckinsForManagersUsers(manager, start, end);

        return ResponseEntity.ok(checkins);
    }
}
