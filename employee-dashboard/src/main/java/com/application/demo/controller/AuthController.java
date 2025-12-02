package com.application.demo.controller;

import com.application.demo.dto.*;
import com.application.demo.entity.Employee;
import com.application.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        Employee user = authService.register(req);
        return ResponseEntity.ok().body("User registered with id: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest req) {
        JwtResponse jwt = authService.login(req);
        return ResponseEntity.ok(jwt);
    }
}
