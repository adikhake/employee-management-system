package com.application.demo.service;

import com.application.demo.dto.*;
import com.application.demo.entity.Employee;
import com.application.demo.entity.Role;
import com.application.demo.entity.User;
import com.application.demo.repository.EmployeeRepository;
import com.application.demo.repository.UserRepository;
import com.application.demo.security.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;

    @Transactional
    public Employee register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(req.getFirstName() + req.getLastName())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .role(Role.ROLE_EMPLOYEE)
                .build();
        userRepo.save(user);

        LocalDate dob = req.getBirthDate() != null && !req.getBirthDate().isBlank()
                ? LocalDate.parse(req.getBirthDate())
                : null;

        Employee emp = Employee.builder()
                .user(user)
                .email(req.getEmail())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .mobile(req.getMobile())
                .gender(req.getGender())
                .birthDate(dob)
                .country(req.getCountry())
                .city(req.getCity())
                .build();

        return employeeRepo.save(emp);
    }

    public JwtResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();

        String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());

        return new JwtResponse(token, "Bearer", user.getId(), user.getEmail(), user.getRole().name());
    }
}
