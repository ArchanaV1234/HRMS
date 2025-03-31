package com.excelr.controller;

import java.time.LocalDate;

public class AttendanceDTO {
    private LocalDate date;
    private boolean status; // "status" instead of "present"
    private Long employeeId; // Just ID instead of full object
	public LocalDate getDate() {
		return date;
	}
	public void setDate(LocalDate date) {
		this.date = date;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public Long getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

    // Getters and 

}