package com.application.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;      // user name
    private String email;
    private String password;

    private String firstName;
    private String lastName;
    private String mobile;
    private String gender;
    private String birthDate; // yyyy-MM-dd
    private String country;
    private String city;
}
