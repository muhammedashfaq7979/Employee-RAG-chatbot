package com.company.policyrag.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EmployeeRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 150)
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Size(max = 100)
    private String department = "Engineering";

    private String role = "ROLE_EMPLOYEE";

    @Valid
    private EmployeeBalanceRequest balances;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public EmployeeBalanceRequest getBalances() {
        return balances;
    }

    public void setBalances(EmployeeBalanceRequest balances) {
        this.balances = balances;
    }
}
