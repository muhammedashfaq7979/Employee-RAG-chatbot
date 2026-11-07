package com.company.policyrag.service;

import com.company.policyrag.dto.EmployeeBalanceRequest;
import com.company.policyrag.dto.EmployeeRequest;
import com.company.policyrag.dto.UserProfileDto;
import com.company.policyrag.model.EmployeeBalance;
import com.company.policyrag.model.User;
import com.company.policyrag.repository.EmployeeBalanceRepository;
import com.company.policyrag.repository.RefreshTokenRepository;
import com.company.policyrag.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class EmployeeService {

    private final UserRepository userRepository;
    private final EmployeeBalanceRepository balanceRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(
            UserRepository userRepository,
            EmployeeBalanceRepository balanceRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.balanceRepository = balanceRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public List<UserProfileDto> listEmployees() {
        List<UserProfileDto> employees = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            employees.add(toProfile(user, findOrCreateBalance(user)));
        }
        return employees;
    }

    @Transactional
    public UserProfileDto getEmployee(UUID id) {
        User user = findUser(id);
        return toProfile(user, findOrCreateBalance(user));
    }

    @Transactional
    public UserProfileDto createEmployee(EmployeeRequest request) {
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required when creating an employee");
        }

        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An employee with this email already exists");
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                normalizeRole(request.getRole()),
                normalizeDepartment(request.getDepartment())
        );
        user = userRepository.save(user);

        EmployeeBalance balance = new EmployeeBalance(user);
        applyBalanceRequest(balance, request.getBalances());
        user.setEmployeeBalance(balance);
        balance = balanceRepository.save(balance);

        return toProfile(user, balance);
    }

    @Transactional
    public UserProfileDto updateEmployee(UUID id, EmployeeRequest request) {
        User user = findUser(id);
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An employee with this email already exists");
        }

        user.setName(request.getName().trim());
        user.setEmail(email);
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            user.setDepartment(normalizeDepartment(request.getDepartment()));
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(normalizeRole(request.getRole()));
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        EmployeeBalance balance = findOrCreateBalance(user);
        if (request.getBalances() != null) {
            applyBalanceRequest(balance, request.getBalances());
        }
        balance.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        balanceRepository.save(balance);
        return toProfile(user, balance);
    }

    @Transactional
    public void deleteEmployee(UUID id) {
        User user = findUser(id);
        refreshTokenRepository.deleteAllByUser_Id(id);
        balanceRepository.findByUser(user).ifPresent(balanceRepository::delete);
        userRepository.delete(user);
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    private EmployeeBalance findOrCreateBalance(User user) {
        return balanceRepository.findByUser(user).orElseGet(() -> {
            EmployeeBalance balance = new EmployeeBalance(user);
            user.setEmployeeBalance(balance);
            return balanceRepository.save(balance);
        });
    }

    private void applyBalanceRequest(EmployeeBalance balance, EmployeeBalanceRequest request) {
        if (request == null) {
            return;
        }
        if (request.getCasualLeaveUsed() > request.getCasualLeaveTotal()
                || request.getSickLeaveUsed() > request.getSickLeaveTotal()
                || request.getEarnedLeaveUsed() > request.getEarnedLeaveTotal()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Used leave cannot exceed the total leave balance");
        }
        balance.setCasualLeaveUsed(request.getCasualLeaveUsed());
        balance.setCasualLeaveTotal(request.getCasualLeaveTotal());
        balance.setSickLeaveUsed(request.getSickLeaveUsed());
        balance.setSickLeaveTotal(request.getSickLeaveTotal());
        balance.setEarnedLeaveUsed(request.getEarnedLeaveUsed());
        balance.setEarnedLeaveTotal(request.getEarnedLeaveTotal());
        balance.setHomeOfficeClaimed(request.getHomeOfficeClaimed());
        balance.setHomeOfficeLimit(request.getHomeOfficeLimit());
        balance.setSecurityScore(request.getSecurityScore());
        balance.setUpdatedAt(LocalDateTime.now());
    }

    private UserProfileDto toProfile(User user, EmployeeBalance balance) {
        Map<String, Object> balances = new HashMap<>();
        balances.put("casualLeave", Map.of(
                "used", balance.getCasualLeaveUsed(),
                "total", balance.getCasualLeaveTotal()
        ));
        balances.put("sickLeave", Map.of(
                "used", balance.getSickLeaveUsed(),
                "total", balance.getSickLeaveTotal()
        ));
        balances.put("earnedLeave", Map.of(
                "used", balance.getEarnedLeaveUsed(),
                "total", balance.getEarnedLeaveTotal()
        ));
        balances.put("homeOfficeClaimed", balance.getHomeOfficeClaimed());
        balances.put("homeOfficeLimit", balance.getHomeOfficeLimit());
        balances.put("securityScore", balance.getSecurityScore());
        return new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                balances
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeDepartment(String department) {
        return department == null || department.isBlank() ? "Engineering" : department.trim();
    }

    private String normalizeRole(String role) {
        String normalized = role == null || role.isBlank()
                ? "ROLE_EMPLOYEE"
                : role.trim().toUpperCase(Locale.ROOT);
        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }
        if (!List.of("ROLE_EMPLOYEE", "ROLE_HR", "ROLE_SECURITY").contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be EMPLOYEE, HR, or SECURITY");
        }
        return normalized;
    }
}
