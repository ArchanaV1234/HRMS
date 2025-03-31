package com.excelr.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.excelr.model.Leave;

import com.excelr.model.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    
    List<Leave> findByEmployeeId(Long employeeId);
    
    List<Leave> findByStatus(String status);
    
    @Query("SELECT l FROM Leave l WHERE l.employee.id = :employeeId AND l.status = 'APPROVED' " +
           "AND ((l.startDate BETWEEN :startDate AND :endDate) OR " +
           "(l.endDate BETWEEN :startDate AND :endDate) OR " +
           "(l.startDate <= :startDate AND l.endDate >= :endDate))")
    List<Leave> findOverlappingLeaves(@Param("employeeId") Long employeeId,
                                    @Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);
    
    @Query("SELECT l FROM Leave l WHERE l.employee.id = :employeeId AND YEAR(l.startDate) = :year AND l.status = 'APPROVED'")
    List<Leave> findApprovedLeavesByEmployeeAndYear(@Param("employeeId") Long employeeId,
                                                  @Param("year") int year);
}