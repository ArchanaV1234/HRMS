package com.excelr.service;

import com.excelr.exception.InvalidDataException;
import com.excelr.exception.ResourceNotFoundException;
import com.excelr.model.Leave;
import com.excelr.repo.EmployeeRepository;
import com.excelr.repo.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public Leave applyLeave(Leave leave) {
        // Validate employee exists before processing leave
        Long employeeId = leave.getEmployee().getId();
        employeeRepository.findById(employeeId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Employee not found with id: " + employeeId));

        validateLeave(leave);
        
        List<Leave> overlappingLeaves = leaveRepository.findOverlappingLeaves(
            employeeId,
            leave.getStartDate(),
            leave.getEndDate());
        
        if (!overlappingLeaves.isEmpty()) {
            throw new InvalidDataException("You already have approved leave during this period");
        }
        
        leave.setStatus("PENDING");
        return leaveRepository.save(leave);
    }
    public List<Leave> getLeavesByEmployeeId(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    @Transactional
    public Leave approveLeave(Long id) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found with id: " + id));
        
        if (!"PENDING".equals(leave.getStatus())) {
            throw new InvalidDataException("Only pending leaves can be approved");
        }
        
        leave.setStatus("APPROVED");
        return leaveRepository.save(leave);
    }

    @Transactional
    public Leave rejectLeave(Long id) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found with id: " + id));
        
        if (!"PENDING".equals(leave.getStatus())) {
            throw new InvalidDataException("Only pending leaves can be rejected");
        }
        
        leave.setStatus("REJECTED");
        return leaveRepository.save(leave);
    }

    public long getLeaveDaysUsed(Long employeeId, int year) {
        List<Leave> approvedLeaves = leaveRepository.findApprovedLeavesByEmployeeAndYear(employeeId, year);
        return approvedLeaves.stream()
                .mapToLong(leave -> ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1)
                .sum();
    }

    private void validateLeave(Leave leave) {
        if (leave.getEmployee() == null || leave.getEmployee().getId() == null) {
            throw new InvalidDataException("Employee must be specified");
        }
        if (leave.getStartDate() == null || leave.getEndDate() == null) {
            throw new InvalidDataException("Start and end dates must be specified");
        }
        if (leave.getStartDate().isAfter(leave.getEndDate())) {
            throw new InvalidDataException("Start date cannot be after end date");
        }
        if (leave.getStartDate().isBefore(LocalDate.now())) {
            throw new InvalidDataException("Cannot apply for leave in the past");
        }
        if (leave.getReason() == null || leave.getReason().isEmpty()) {
            throw new InvalidDataException("Leave reason must be specified");
        }
    }
}