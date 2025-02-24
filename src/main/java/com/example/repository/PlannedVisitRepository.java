package com.example.repository;

import com.example.model.PlannedVisit;
import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PlannedVisitRepository extends JpaRepository<PlannedVisit, Long> {
    List<PlannedVisit> findByUserAndPlannedTimeBetweenOrderByPlannedTimeAsc(User user, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT pv FROM PlannedVisit pv WHERE pv.user.manager = :manager AND pv.plannedTime >= :start")
    List<PlannedVisit> findFutureVisitsForManagersUsers(@Param("manager") User manager, @Param("start") LocalDateTime start);
}
