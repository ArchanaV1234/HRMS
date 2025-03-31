package com.excelr.controller;

import com.excelr.exception.InvalidDataException;
import com.excelr.exception.ResourceNotFoundException;
import com.excelr.model.Employee;
import com.excelr.model.Leave;
import com.excelr.repo.EmployeeRepository;
import com.excelr.repo.LeaveRepository;
import com.excelr.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private LeaveRepository leaveRepository;

    @PostMapping
    public ResponseEntity<Leave> applyLeave(@RequestBody LeaveRequestDTO leaveRequest) {
        Employee employee = employeeRepository.findById(leaveRequest.getEmployeeId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Employee not found with id: " + leaveRequest.getEmployeeId()));
                
        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setStartDate(leaveRequest.getStartDate());
        leave.setEndDate(leaveRequest.getEndDate());
        leave.setReason(leaveRequest.getReason());
        
        return ResponseEntity.ok(leaveService.applyLeave(leave));
    }
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<Leave>> getLeavesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployeeId(employeeId));
    }
    @GetMapping
    public ResponseEntity<List<Leave>> getAllLeaves() {
        List<Leave> leaves = leaveService.getAllLeaves();
        return ResponseEntity.ok(leaves);
    }
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id) {
        Optional<Leave> leaveOpt = leaveRepository.findById(id);
        if (leaveOpt.isPresent()) {
            Leave leave = leaveOpt.get();
            leave.setStatus("APPROVED");
            leaveRepository.save(leave);
            return ResponseEntity.ok("Leave approved");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Leave not found");
    }


    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(leaveService.rejectLeave(id));
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/employee/{employeeId}/balance")
    public ResponseEntity<Long> getLeaveBalance(
            @PathVariable Long employeeId,
            @RequestParam int year) {
        return ResponseEntity.ok(leaveService.getLeaveDaysUsed(employeeId, year));
    }
}