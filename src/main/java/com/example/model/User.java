package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "manager")
    private List<User> managedUsers;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Checkin> checkins;

    @OneToMany(mappedBy = "user")
    private List<EventAttendance> eventAttendances;
}
