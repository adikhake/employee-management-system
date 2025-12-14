package com.application.demo.dto;

import lombok.Data;

@Data
public class EmployeeUpdateRequest {
    private String firstName;
    private String lastName;
    private String mobile;
    private String gender;
    private String birthDate; 
    private String country;
    private String city;
}
