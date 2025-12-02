package com.application.demo.service;

import com.application.demo.dto.EmployeeResponse;
import com.application.demo.dto.EmployeeUpdateRequest;
import com.application.demo.dto.RegisterRequest;
import com.application.demo.entity.Employee;
import com.application.demo.entity.Role;
import com.application.demo.entity.User;
import com.application.demo.repository.EmployeeRepository;
import com.application.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final PasswordEncoder passwordEncoder;

    // -----------------------
    // Admin management APIs
    // -----------------------

    @Transactional
    public EmployeeResponse createEmployee(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String fullName = req.getFirstName() + " " + req.getLastName();

        User user = User.builder()
                .name(fullName)
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.ROLE_EMPLOYEE)
                .build();
        user = userRepo.save(user);

        LocalDate dob = parseDate(req.getBirthDate());

        Employee emp = Employee.builder()
                .user(user)
                .email(user.getEmail())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .mobile(req.getMobile())
                .gender(req.getGender())
                .birthDate(dob)
                .country(req.getCountry())
                .city(req.getCity())
                .build();

        emp = employeeRepo.save(emp);
        return toResponse(emp);
    }

    public List<EmployeeResponse> listAll() {
        return employeeRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    
    @Transactional
    public EmployeeResponse updateEmployee(Long id, RegisterRequest req) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));

        User user = emp.getUser();
        if (req.getEmail() != null && !req.getEmail().isBlank() && !req.getEmail().equals(user.getEmail())) {
            if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email already used");
            user.setEmail(req.getEmail());
            emp.setEmail(req.getEmail());
        }
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPassword() != null && !req.getPassword().isBlank())
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepo.save(user);

        if (req.getFirstName() != null) emp.setFirstName(req.getFirstName());
        if (req.getLastName() != null) emp.setLastName(req.getLastName());
        if (req.getMobile() != null) emp.setMobile(req.getMobile());
        if (req.getGender() != null) emp.setGender(req.getGender());
        if (req.getBirthDate() != null && !req.getBirthDate().isBlank())
            emp.setBirthDate(parseDate(req.getBirthDate()));
        if (req.getCountry() != null) emp.setCountry(req.getCountry());
        if (req.getCity() != null) emp.setCity(req.getCity());

        emp = employeeRepo.save(emp);
        return toResponse(emp);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee emp = employeeRepo.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        employeeRepo.delete(emp);
        userRepo.deleteById(emp.getUser().getId());
    }

    public List<EmployeeResponse> search(String name, String mobile) {
        return employeeRepo.search(name, mobile).stream().map(this::toResponse).collect(Collectors.toList());
    }

    // -----------------------
    // Employee self APIs
    // -----------------------

    public EmployeeResponse getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Employee emp = employeeRepo.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));
        return toResponse(emp);
    }

    @Transactional
    public EmployeeResponse updateMyProfile(EmployeeUpdateRequest req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Employee emp = employeeRepo.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Profile not found"));

        if (req.getFirstName() != null) emp.setFirstName(req.getFirstName());
        if (req.getLastName() != null) emp.setLastName(req.getLastName());
        if (req.getMobile() != null) emp.setMobile(req.getMobile());
        if (req.getGender() != null) emp.setGender(req.getGender());
        if (req.getBirthDate() != null && !req.getBirthDate().isBlank()) emp.setBirthDate(parseDate(req.getBirthDate()));
        if (req.getCountry() != null) emp.setCountry(req.getCountry());
        if (req.getCity() != null) emp.setCity(req.getCity());

        emp = employeeRepo.save(emp);
        return toResponse(emp);
    }

    // -----------------------
    // Helpers
    // -----------------------

    private EmployeeResponse toResponse(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .userId(e.getUser().getId())
                .name(e.getUser().getName())
                .email(e.getEmail())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .mobile(e.getMobile())
                .gender(e.getGender())
                .birthDate(e.getBirthDate() != null ? e.getBirthDate().toString() : null)
                .country(e.getCountry())
                .city(e.getCity())
                .build();
    }

    private LocalDate parseDate(String s) {
        try {
            return (s == null || s.isBlank()) ? null : LocalDate.parse(s);
        } catch (Exception ex) {
            throw new RuntimeException("Invalid date format, expected yyyy-MM-dd");
        }
    }
}
