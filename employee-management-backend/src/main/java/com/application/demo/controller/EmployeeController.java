package com.application.demo.controller;

import com.application.demo.dto.EmployeeResponse;
import com.application.demo.dto.EmployeeUpdateRequest;
import com.application.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<EmployeeResponse> updateMyProfile(@RequestBody EmployeeUpdateRequest req) {
        EmployeeResponse resp = employeeService.updateMyProfile(req);
        return ResponseEntity.ok(resp);
    }
    
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<EmployeeResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String mobile) {
        List<EmployeeResponse> results = employeeService.search(name, mobile);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<EmployeeResponse>> listAll() {
        List<EmployeeResponse> all = employeeService.listAll();
        return ResponseEntity.ok(all);
    }
}
