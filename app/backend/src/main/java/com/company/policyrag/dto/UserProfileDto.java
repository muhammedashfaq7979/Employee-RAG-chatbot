package com.company.policyrag.dto;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

public class UserProfileDto {

    private UUID id;
    private String name;
    private String email;
    private String role;
    private String department;
    private Map<String, Object> balances;

    public UserProfileDto() {}

    public UserProfileDto(UUID id, String name, String email, String role, String department, Map<String, Object> balances) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.balances = balances;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Map<String, Object> getBalances() {
        return balances;
    }

    public void setBalances(Map<String, Object> balances) {
        this.balances = balances;
    }
}
