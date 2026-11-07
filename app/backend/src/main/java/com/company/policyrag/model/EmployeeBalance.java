package com.company.policyrag.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employee_balances")
public class EmployeeBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "casual_leave_used")
    private int casualLeaveUsed = 0;

    @Column(name = "casual_leave_total")
    private int casualLeaveTotal = 12;

    @Column(name = "sick_leave_used")
    private int sickLeaveUsed = 0;

    @Column(name = "sick_leave_total")
    private int sickLeaveTotal = 10;

    @Column(name = "earned_leave_used")
    private int earnedLeaveUsed = 0;

    @Column(name = "earned_leave_total")
    private int earnedLeaveTotal = 15;

    @Column(name = "home_office_claimed", precision = 10, scale = 2)
    private BigDecimal homeOfficeClaimed = BigDecimal.ZERO;

    @Column(name = "home_office_limit", precision = 10, scale = 2)
    private BigDecimal homeOfficeLimit = new BigDecimal("500.00");

    @Column(name = "security_score")
    private int securityScore = 100;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public EmployeeBalance() {}

    public EmployeeBalance(User user) {
        this.user = user;
        this.casualLeaveUsed = 0;
        this.casualLeaveTotal = 12;
        this.sickLeaveUsed = 0;
        this.sickLeaveTotal = 10;
        this.earnedLeaveUsed = 0;
        this.earnedLeaveTotal = 15;
        this.homeOfficeClaimed = BigDecimal.ZERO;
        this.homeOfficeLimit = new BigDecimal("500.00");
        this.securityScore = 100;
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getCasualLeaveUsed() {
        return casualLeaveUsed;
    }

    public void setCasualLeaveUsed(int casualLeaveUsed) {
        this.casualLeaveUsed = casualLeaveUsed;
    }

    public int getCasualLeaveTotal() {
        return casualLeaveTotal;
    }

    public void setCasualLeaveTotal(int casualLeaveTotal) {
        this.casualLeaveTotal = casualLeaveTotal;
    }

    public int getSickLeaveUsed() {
        return sickLeaveUsed;
    }

    public void setSickLeaveUsed(int sickLeaveUsed) {
        this.sickLeaveUsed = sickLeaveUsed;
    }

    public int getSickLeaveTotal() {
        return sickLeaveTotal;
    }

    public void setSickLeaveTotal(int sickLeaveTotal) {
        this.sickLeaveTotal = sickLeaveTotal;
    }

    public int getEarnedLeaveUsed() {
        return earnedLeaveUsed;
    }

    public void setEarnedLeaveUsed(int earnedLeaveUsed) {
        this.earnedLeaveUsed = earnedLeaveUsed;
    }

    public int getEarnedLeaveTotal() {
        return earnedLeaveTotal;
    }

    public void setEarnedLeaveTotal(int earnedLeaveTotal) {
        this.earnedLeaveTotal = earnedLeaveTotal;
    }

    public BigDecimal getHomeOfficeClaimed() {
        return homeOfficeClaimed;
    }

    public void setHomeOfficeClaimed(BigDecimal homeOfficeClaimed) {
        this.homeOfficeClaimed = homeOfficeClaimed;
    }

    public BigDecimal getHomeOfficeLimit() {
        return homeOfficeLimit;
    }

    public void setHomeOfficeLimit(BigDecimal homeOfficeLimit) {
        this.homeOfficeLimit = homeOfficeLimit;
    }

    public int getSecurityScore() {
        return securityScore;
    }

    public void setSecurityScore(int securityScore) {
        this.securityScore = securityScore;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
