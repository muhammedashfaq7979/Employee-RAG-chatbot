package com.company.policyrag.service;

import com.company.policyrag.dto.EmployeeRequest;
import com.company.policyrag.dto.UserProfileDto;
import com.company.policyrag.model.EmployeeBalance;
import com.company.policyrag.model.User;
import com.company.policyrag.repository.EmployeeBalanceRepository;
import com.company.policyrag.repository.RefreshTokenRepository;
import com.company.policyrag.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {

    @Test
    void creatingEmployeeAlsoCreatesDefaultBalance() {
        UserRepository userRepository = mock(UserRepository.class);
        EmployeeBalanceRepository balanceRepository = mock(EmployeeBalanceRepository.class);
        RefreshTokenRepository refreshTokenRepository = mock(RefreshTokenRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        when(userRepository.existsByEmailIgnoreCase("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(balanceRepository.save(any(EmployeeBalance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeService employeeService = new EmployeeService(
                userRepository,
                balanceRepository,
                refreshTokenRepository,
                passwordEncoder
        );
        EmployeeRequest request = new EmployeeRequest();
        request.setName("Alex Rivera");
        request.setEmail("Alex@Example.com");
        request.setPassword("password123");

        UserProfileDto employee = employeeService.createEmployee(request);
        Map<?, ?> casualLeave = (Map<?, ?>) employee.getBalances().get("casualLeave");

        assertEquals("alex@example.com", employee.getEmail());
        assertEquals(12, casualLeave.get("total"));
        assertEquals(0, casualLeave.get("used"));
        verify(balanceRepository).save(any(EmployeeBalance.class));
    }
}
