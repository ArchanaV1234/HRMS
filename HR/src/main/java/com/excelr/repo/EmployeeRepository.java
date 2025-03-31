
package com.excelr.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.excelr.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByUsername(String username);
    Optional<Employee> findByEmail(String email);

}
