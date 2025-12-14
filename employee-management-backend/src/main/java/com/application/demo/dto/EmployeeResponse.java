package com.application.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeResponse {

    private Long id;
    private Long userId;

    private String email;

    private String firstName;
    private String lastName;
    private String mobile;
    private String gender;
    private String birthDate;

    private String country;
    private String city;
}
