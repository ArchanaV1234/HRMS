package com.excelr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.excelr.model.Employee;
import com.excelr.repo.EmployeeRepository;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public Employee addEmployee(Employee employee) {
        if (employee.getRole() == null || employee.getRole().isEmpty()) {
            employee.setRole("ROLE_EMPLOYEE");
        }
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setName(updatedEmployee.getName());
            employee.setUsername(updatedEmployee.getUsername());
            employee.setPassword(updatedEmployee.getPassword());
            employee.setEmail(updatedEmployee.getEmail());
            employee.setPhone(updatedEmployee.getPhone());
            employee.setJob(updatedEmployee.getJob());
            if (updatedEmployee.getRole() == null || updatedEmployee.getRole().isEmpty()) {
                employee.setRole("ROLE_EMPLOYEE");
            } else {
                employee.setRole(updatedEmployee.getRole());
            }
            employee.setSalary(updatedEmployee.getSalary());
            employee.setJoiningDate(updatedEmployee.getJoiningDate());
            return employeeRepository.save(employee);
        }).orElse(null);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}