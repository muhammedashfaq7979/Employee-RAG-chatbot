package com.company.policyrag.service;

import com.company.policyrag.dto.AuthResponse;
import com.company.policyrag.dto.LoginRequest;
import com.company.policyrag.dto.RegisterRequest;
import com.company.policyrag.dto.UserProfileDto;
import com.company.policyrag.model.EmployeeBalance;
import com.company.policyrag.model.RefreshToken;
import com.company.policyrag.model.User;
import com.company.policyrag.repository.EmployeeBalanceRepository;
import com.company.policyrag.repository.RefreshTokenRepository;
import com.company.policyrag.repository.UserRepository;
import com.company.policyrag.security.CustomUserDetailsService;
import com.company.policyrag.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final EmployeeBalanceRepository balanceRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final long refreshExpirationDays;

    public AuthService(
            UserRepository userRepository,
            EmployeeBalanceRepository balanceRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            @Value("${jwt.refresh-expiration-days}") long refreshExpirationDays
    ) {
        this.userRepository = userRepository;
        this.balanceRepository = balanceRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.refreshExpirationDays = refreshExpirationDays;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                "ROLE_EMPLOYEE",
                request.getDepartment()
        );
        user = userRepository.save(user);

        EmployeeBalance balance = new EmployeeBalance(user);
        user.setEmployeeBalance(balance);
        balance = balanceRepository.save(balance);

        return createAuthResponse(user, balance, "Registration successful!");
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        EmployeeBalance balance = findOrCreateBalance(user);
        return createAuthResponse(user, balance, "Login successful!");
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        String tokenHash = hashRefreshToken(rawRefreshToken);
        RefreshToken oldToken = refreshTokenRepository.findByTokenHashForUpdate(tokenHash)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        if (!oldToken.getExpiresAt().isAfter(Instant.now())) {
            throw new BadCredentialsException("Refresh token has expired");
        }

        User user = oldToken.getUser();
        refreshTokenRepository.delete(oldToken);
        EmployeeBalance balance = findOrCreateBalance(user);
        return createAuthResponse(user, balance, "Token refreshed successfully");
    }

    @Transactional
    public void logout(String rawRefreshToken, String authenticatedEmail) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            refreshTokenRepository.findByTokenHash(hashRefreshToken(rawRefreshToken))
                    .filter(token -> token.getUser().getEmail().equalsIgnoreCase(authenticatedEmail))
                    .ifPresent(refreshTokenRepository::delete);
        }
    }

    @Transactional
    public UserProfileDto getCurrentUserProfile(String email) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return mapToProfileDto(user, findOrCreateBalance(user));
    }

    private AuthResponse createAuthResponse(User user, EmployeeBalance balance, String message) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        String rawRefreshToken = generateRefreshToken();
        RefreshToken refreshToken = new RefreshToken(
                hashRefreshToken(rawRefreshToken),
                user,
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );
        refreshTokenRepository.save(refreshToken);
        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                jwtService.getExpirationSeconds(),
                mapToProfileDto(user, balance),
                message
        );
    }

    private EmployeeBalance findOrCreateBalance(User user) {
        return balanceRepository.findByUser(user).orElseGet(() -> {
            EmployeeBalance balance = new EmployeeBalance(user);
            user.setEmployeeBalance(balance);
            return balanceRepository.save(balance);
        });
    }

    private UserProfileDto mapToProfileDto(User user, EmployeeBalance balance) {
        Map<String, Object> balances = new HashMap<>();
        balances.put("casualLeave", leaveBalance(balance.getCasualLeaveUsed(), balance.getCasualLeaveTotal()));
        balances.put("sickLeave", leaveBalance(balance.getSickLeaveUsed(), balance.getSickLeaveTotal()));
        balances.put("earnedLeave", leaveBalance(balance.getEarnedLeaveUsed(), balance.getEarnedLeaveTotal()));
        balances.put("homeOfficeClaimed", balance.getHomeOfficeClaimed() != null
                ? balance.getHomeOfficeClaimed() : BigDecimal.ZERO);
        balances.put("homeOfficeLimit", balance.getHomeOfficeLimit() != null
                ? balance.getHomeOfficeLimit() : new BigDecimal("500.00"));
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

    private Map<String, Integer> leaveBalance(int used, int total) {
        Map<String, Integer> balance = new HashMap<>();
        balance.put("used", used);
        balance.put("total", total);
        return balance;
    }

    private String generateRefreshToken() {
        byte[] bytes = new byte[48];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashRefreshToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
