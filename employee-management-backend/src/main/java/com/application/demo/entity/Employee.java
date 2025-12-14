package com.application.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email; 

    private String mobile;
    private String gender;  
    private LocalDate birthDate;
    private String country;
    private String city;
}
