package com.excelr.controller;

import com.excelr.exception.ResourceNotFoundException;
import com.excelr.model.Attendance;
import com.excelr.model.Employee;
import com.excelr.repo.AttendanceRepository;
import com.excelr.repo.EmployeeRepository;
import com.excelr.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(@RequestBody AttendanceDTO dto) {
        // Fetch the existing employee first
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + dto.getEmployeeId()));
        
        Attendance attendance = new Attendance();
        attendance.setDate(dto.getDate());
        attendance.setPresent(dto.isStatus());
        attendance.setEmployee(employee); // Use the managed entity
        
        Attendance saved = attendanceRepository.save(attendance);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{employeeId}/checkin")
    public ResponseEntity<Attendance> checkIn(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkIn(employeeId));
    }
    @PostMapping("/{employeeId}/checkout")
    public ResponseEntity<Attendance> checkOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkOut(employeeId));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(employeeId));
    }

    @GetMapping("/period")
    public ResponseEntity<List<Attendance>> getAttendanceForPeriod(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(attendanceService.getAttendanceBetweenDates(start, end));
    }
}