package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column
    private String address;

    @OneToMany(mappedBy = "location")
    private List<User> users;

    @OneToMany(mappedBy = "location")
    private List<Event> events;
}
