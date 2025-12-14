package com.application.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter 
@NoArgsConstructor
@AllArgsConstructor 
@Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; 

    private String name; 

    @Enumerated(EnumType.STRING)
    private Role role;
}
