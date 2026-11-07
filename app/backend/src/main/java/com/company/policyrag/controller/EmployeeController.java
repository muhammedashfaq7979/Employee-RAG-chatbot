package com.company.policyrag.controller;

import com.company.policyrag.dto.EmployeeRequest;
import com.company.policyrag.dto.UserProfileDto;
import com.company.policyrag.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employees", description = "HR employee CRUD with associated employee leave and allowance balances")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @Operation(summary = "List employees")
    public List<UserProfileDto> listEmployees() {
        return employeeService.listEmployees();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public UserProfileDto getEmployee(@PathVariable UUID id) {
        return employeeService.getEmployee(id);
    }

    @PostMapping
    @Operation(summary = "Create employee with default or supplied balances")
    public ResponseEntity<UserProfileDto> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.createEmployee(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update employee profile and optionally balances")
    public UserProfileDto updateEmployee(
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest request
    ) {
        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete employee and associated balances")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
