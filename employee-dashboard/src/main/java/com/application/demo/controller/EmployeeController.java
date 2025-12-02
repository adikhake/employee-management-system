package com.application.demo.controller;

import com.application.demo.dto.EmployeeResponse;
import com.application.demo.dto.EmployeeUpdateRequest;
import com.application.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EmployeeResponse> getMyProfile() {
        EmployeeResponse resp = employeeService.getMyProfile();
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EmployeeResponse> updateMyProfile(@RequestBody EmployeeUpdateRequest req) {
        EmployeeResponse resp = employeeService.updateMyProfile(req);
        return ResponseEntity.ok(resp);
    }
}
