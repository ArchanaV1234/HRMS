package com.excelr.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(uniqueConstraints = {
	    @UniqueConstraint(
	        name = "UK_employee_payperiod",
	        columnNames = {"employee_id", "pay_period"}
	    )
	})
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private double basicSalary;
    private double deductions;
    private double netSalary;
    
    private LocalDate payPeriod; // Changed to LocalDate

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public double getDeductions() {
        return deductions;
    }

    public void setDeductions(double deductions) {
        this.deductions = deductions;
    }

    public double getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(double netSalary) {
        this.netSalary = netSalary;
    }

    public LocalDate getPayPeriod() {
        return payPeriod;
    }

    public void setPayPeriod(LocalDate payPeriod) {
        this.payPeriod = payPeriod;
    }
}