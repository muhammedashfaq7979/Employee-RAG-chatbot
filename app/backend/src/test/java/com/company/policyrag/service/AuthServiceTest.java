package com.company.policyrag.service;

import com.company.policyrag.dto.AuthResponse;
import com.company.policyrag.dto.RegisterRequest;
import com.company.policyrag.model.EmployeeBalance;
import com.company.policyrag.model.RefreshToken;
import com.company.policyrag.model.User;
import com.company.policyrag.repository.EmployeeBalanceRepository;
import com.company.policyrag.repository.RefreshTokenRepository;
import com.company.policyrag.repository.UserRepository;
import com.company.policyrag.security.CustomUserDetailsService;
import com.company.policyrag.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Test
    void refreshRotatesTokenAndRejectsReplay() {
        UserRepository userRepository = mock(UserRepository.class);
        EmployeeBalanceRepository balanceRepository = mock(EmployeeBalanceRepository.class);
        RefreshTokenRepository refreshTokenRepository = mock(RefreshTokenRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtService jwtService = mock(JwtService.class);
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        CustomUserDetailsService userDetailsService = mock(CustomUserDetailsService.class);
        User user = new User("Alex Rivera", "alex@example.com", "encoded", "ROLE_EMPLOYEE", "Engineering");
        EmployeeBalance balance = new EmployeeBalance(user);
        RefreshToken oldToken = new RefreshToken("old-hash", user, Instant.now().plus(7, ChronoUnit.DAYS));

        when(refreshTokenRepository.findByTokenHashForUpdate(anyString()))
                .thenReturn(Optional.of(oldToken), Optional.empty());
        when(balanceRepository.findByUser(user)).thenReturn(Optional.of(balance));
        when(userDetailsService.loadUserByUsername("alex@example.com")).thenReturn(
                org.springframework.security.core.userdetails.User.withUsername("alex@example.com")
                        .password("encoded")
                        .authorities("ROLE_EMPLOYEE")
                        .build()
        );
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("new-access-token");
        when(jwtService.getExpirationSeconds()).thenReturn(900L);

        AuthService authService = new AuthService(
                userRepository,
                balanceRepository,
                refreshTokenRepository,
                passwordEncoder,
                jwtService,
                authenticationManager,
                userDetailsService,
                7
        );

        AuthResponse response = authService.refresh("old-refresh-token");

        assertEquals("new-access-token", response.getToken());
        assertNotNull(response.getRefreshToken());
        assertNotEquals("old-refresh-token", response.getRefreshToken());
        verify(refreshTokenRepository).delete(oldToken);
        assertThrows(BadCredentialsException.class, () -> authService.refresh("old-refresh-token"));
    }

    @Test
    void registrationCreatesEmployeeWithAssociatedBalanceAndRefreshToken() {
        UserRepository userRepository = mock(UserRepository.class);
        EmployeeBalanceRepository balanceRepository = mock(EmployeeBalanceRepository.class);
        RefreshTokenRepository refreshTokenRepository = mock(RefreshTokenRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtService jwtService = mock(JwtService.class);
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        CustomUserDetailsService userDetailsService = mock(CustomUserDetailsService.class);

        when(userRepository.existsByEmailIgnoreCase("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(balanceRepository.save(any(EmployeeBalance.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userDetailsService.loadUserByUsername("alex@example.com")).thenReturn(
                org.springframework.security.core.userdetails.User.withUsername("alex@example.com")
                        .password("encoded")
                        .authorities("ROLE_EMPLOYEE")
                        .build()
        );
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("access-token");
        when(jwtService.getExpirationSeconds()).thenReturn(900L);

        AuthService authService = new AuthService(
                userRepository,
                balanceRepository,
                refreshTokenRepository,
                passwordEncoder,
                jwtService,
                authenticationManager,
                userDetailsService,
                7
        );
        RegisterRequest request = new RegisterRequest(
                "Alex Rivera",
                "Alex@Example.com",
                "password123",
                "Engineering",
                "ROLE_ADMIN"
        );

        AuthResponse response = authService.register(request);

        assertEquals("access-token", response.getToken());
        assertNotNull(response.getRefreshToken());
        assertEquals(900, response.getExpiresIn());
        assertEquals("ROLE_EMPLOYEE", response.getUser().getRole());
        verify(balanceRepository).save(any(EmployeeBalance.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }
}
