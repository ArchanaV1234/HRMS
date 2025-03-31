package com.excelr.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import com.excelr.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);  // Correct return type
}
