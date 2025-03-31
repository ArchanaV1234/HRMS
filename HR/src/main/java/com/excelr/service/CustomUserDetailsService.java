package com.excelr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.excelr.repo.UserRepository;
import com.excelr.repo.EmployeeRepository;
import com.excelr.model.Employee;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First, try to load from the users table
        com.excelr.model.User user = userRepository.findByUsername(username);
        if (user != null) {
            String role = (user.getRole() != null) ? user.getRole() : "ROLE_USER";
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
            return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
            );
        }
        
        // Next, try to load from the employees table
        Employee employee = employeeRepository.findByUsername(username).orElse(null);
        if (employee != null) {
            String role = (employee.getRole() != null) ? employee.getRole() : "ROLE_EMPLOYEE";
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
            return new org.springframework.security.core.userdetails.User(
                employee.getUsername(),
                employee.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
            );
        }
        
        // If not found in either table, throw an exception
        throw new UsernameNotFoundException("User not found: " + username);
    }
}
