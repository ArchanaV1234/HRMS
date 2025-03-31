
package com.excelr.controller;

import com.excelr.exception.ResourceNotFoundException;
import com.excelr.model.Employee;
import com.excelr.model.Payroll;
import com.excelr.repo.EmployeeRepository;
import com.excelr.repo.PayrollRepository;
import com.excelr.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payrolls")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PayrollRepository payrollRepository;

    @PostMapping
    public ResponseEntity<?> createPayroll(@RequestBody PayrollRequest request) {
        // Check if payroll already exists
        Optional<Payroll> existing = payrollRepository.findByEmployeeIdAndPayPeriod(
            request.getEmployeeId(), 
            request.getPayPeriod()
        );
        
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                    "error", "Duplicate payroll entry",
                    "message", "Payroll already exists for employee " + request.getEmployeeId() + 
                              " and period " + request.getPayPeriod(),
                    "existingPayrollId", existing.get().getId()
                ));
        }

        // Create new payroll
        Employee employee = employeeRepository.findById(request.getEmployeeId())
            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setBasicSalary(request.getBasicSalary());
        payroll.setDeductions(request.getDeductions());
        payroll.setPayPeriod(request.getPayPeriod());
        payroll.setNetSalary(request.getBasicSalary() - request.getDeductions());
        
        Payroll saved = payrollRepository.save(payroll);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollsByEmployeeId(@PathVariable Long employeeId) {
        // Verify employee exists first
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }
        
        List<Payroll> payrolls = payrollRepository.findByEmployeeIdWithEmployee(employeeId);
        return ResponseEntity.ok(payrolls);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {
        if (!payrollRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payroll not found");
        }
        payrollRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{employeeId}")
    public ResponseEntity<Payroll> generateMonthlyPayroll(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return ResponseEntity.ok(payrollService.generateMonthlyPayroll(employeeId, yearMonth));
    }}