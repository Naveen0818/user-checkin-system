package com.example.repository;

import com.example.model.Checkin;
import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CheckinRepository extends JpaRepository<Checkin, Long> {
    @Query("SELECT FUNCTION('MONTH', c.checkinTime) as month, COUNT(c) as count " +
           "FROM Checkin c " +
           "WHERE c.user = :user " +
           "AND c.checkinTime BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('MONTH', c.checkinTime) " +
           "ORDER BY month")
    List<Object[]> getMonthlyCheckinStats(@Param("user") User user, 
                                        @Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);

    @Query("SELECT c FROM Checkin c " +
           "WHERE c.user.manager = :manager " +
           "AND c.checkinTime BETWEEN :startDate AND :endDate " +
           "ORDER BY c.checkinTime DESC")
    List<Checkin> findCheckinsForManagersUsers(@Param("manager") User manager,
                                             @Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);
}
