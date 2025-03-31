package com.excelr.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
    private String email;
    private String phone;
    private String job;

    private String role = "ROLE_EMPLOYEE";
    private double salary;

    @Temporal(TemporalType.DATE)
    private Date joiningDate;
}
