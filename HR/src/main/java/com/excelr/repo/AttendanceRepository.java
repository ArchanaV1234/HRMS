package com.excelr.repo;

import com.excelr.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByEmployeeId(Long employeeId);
    
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
    
    boolean existsByEmployeeIdAndDate(Long employeeId, LocalDate date);
    
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE " +
           "a.employee.id = :employeeId AND " +
           "a.date BETWEEN :startDate AND :endDate AND " +
           "a.present = true")
    long countByEmployeeIdAndDateBetweenAndPresentTrue(
        @Param("employeeId") Long employeeId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
}