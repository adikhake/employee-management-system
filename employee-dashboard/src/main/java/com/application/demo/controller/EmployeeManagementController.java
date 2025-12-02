package com.application.demo.controller;

import com.application.demo.dto.EmployeeResponse;
import com.application.demo.dto.RegisterRequest;
import com.application.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeManagementController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> create(@RequestBody RegisterRequest req) {
        EmployeeResponse resp = employeeService.createEmployee(req);
        return ResponseEntity.ok(resp);
    }

    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponse>> listAll() {
        List<EmployeeResponse> all = employeeService.listAll();
        return ResponseEntity.ok(all);
    }

   
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> update(@PathVariable Long id, @RequestBody RegisterRequest req) {
        EmployeeResponse resp = employeeService.updateEmployee(id, req);
        return ResponseEntity.ok(resp);
    }

   
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String mobile) {
        List<EmployeeResponse> results = employeeService.search(name, mobile);
        return ResponseEntity.ok(results);
    }
}
