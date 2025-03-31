//package com.excelr.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import com.excelr.model.Employee;
//import com.excelr.service.EmployeeService;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/employees")
//public class EmployeeController {
//
//    @Autowired
//    private EmployeeService employeeService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @GetMapping
//    public ResponseEntity<List<Employee>> getAllEmployees() {
//        List<Employee> employees = employeeService.getAllEmployees();
//        return new ResponseEntity<>(employees, HttpStatus.OK);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
//        Employee employee = employeeService.getEmployeeById(id);
//        if (employee != null) {
//            return new ResponseEntity<>(employee, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
//
//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public Employee addEmployee(@RequestBody Employee employee) {
//        // Hash the password before saving
//        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
//        return employeeService.addEmployee(employee);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
//        // Check if the incoming password is already encoded using a robust regex check.
//        // BCrypt hashes typically start with "$2a$", "$2b$", or "$2y$" and are 60 characters long.
//        if (!employee.getPassword().matches("^\\$2[aby]\\$.{56}$")) {
//             employee.setPassword(passwordEncoder.encode(employee.getPassword()));
//        }
//        Employee updatedEmployee = employeeService.updateEmployee(id, employee);
//        if (updatedEmployee != null) {
//            return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }
//
//
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('HR')")
//    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
//        try {
//            employeeService.deleteEmployee(id);
//            return ResponseEntity.ok(Map.of(
//                "status", "success",
//                "message", "Employee deleted successfully"
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(404).body(Map.of(
//                "status", "error",
//                "message", e.getMessage()
//            ));
//        }
//    }
//}
package com.excelr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.excelr.model.Employee;
import com.excelr.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all employees (accessible by any authenticated user or as per security config)
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    // Get a single employee by id
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employee);
    }

    // Create a new employee - only users with ROLE_HR can create
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        // Encode the password before saving
        if (employee.getPassword() != null && !employee.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }
        Employee createdEmployee = employeeService.addEmployee(employee);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    // Update an existing employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        // Handle password: if provided and not already encoded, encode it.
        if (employee.getPassword() != null && !employee.getPassword().isEmpty()) {
            // BCrypt hashes typically match the regex below (starts with "$2a$", "$2b$", or "$2y$" and are 60 characters long)
            if (!employee.getPassword().matches("^\\$2[aby]\\$.{56}$")) {
                employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            }
        } else {
            // If password is not provided, retain the existing password
            Employee existing = employeeService.getEmployeeById(id);
            if (existing != null) {
                employee.setPassword(existing.getPassword());
            }
        }
        Employee updatedEmployee = employeeService.updateEmployee(id, employee);
        if (updatedEmployee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedEmployee);
    }

    // Delete an employee - only users with ROLE_HR can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
