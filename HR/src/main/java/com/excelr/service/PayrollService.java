package com.excelr.service;

import com.excelr.model.Payroll;
import com.excelr.model.Employee;
import com.excelr.repo.PayrollRepository;
import com.excelr.repo.EmployeeRepository;
import com.excelr.exception.ResourceNotFoundException;
import com.excelr.exception.InvalidDataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public Payroll createPayroll(Payroll payroll) {
        validatePayroll(payroll);
        
        if (payrollRepository.existsByEmployeeIdAndPayPeriod(
            payroll.getEmployee().getId(), 
            payroll.getPayPeriod())) {
            throw new InvalidDataException("Payroll already exists for this period");
        }
        
        calculateNetSalary(payroll);
        return payrollRepository.save(payroll);
    }

    public List<Payroll> getPayrollsByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeIdWithEmployee(employeeId);
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + id));
    }

    @Transactional
    public void deletePayroll(Long id) {
        if (!payrollRepository.existsById(id)) {
            throw new ResourceNotFoundException("Payroll not found with id: " + id);
        }
        payrollRepository.deleteById(id);
    }

    public Payroll generateMonthlyPayroll(Long employeeId, YearMonth yearMonth) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        LocalDate payPeriod = yearMonth.atDay(1);
        
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setPayPeriod(payPeriod);
        payroll.setBasicSalary(employee.getSalary());
        
        // Calculate deductions would go here
        payroll.setDeductions(0); // Placeholder - implement your deduction logic
        
        calculateNetSalary(payroll);
        return createPayroll(payroll);
    }

    private void calculateNetSalary(Payroll payroll) {
        payroll.setNetSalary(payroll.getBasicSalary() - payroll.getDeductions());
    }

    private void validatePayroll(Payroll payroll) {
        if (payroll.getEmployee() == null || payroll.getEmployee().getId() == null) {
            throw new InvalidDataException("Employee must be specified");
        }
        if (payroll.getPayPeriod() == null) {
            throw new InvalidDataException("Pay period must be specified");
        }
        if (payroll.getBasicSalary() <= 0) {
            throw new InvalidDataException("Basic salary must be positive");
        }
    }
}