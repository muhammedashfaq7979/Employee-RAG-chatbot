package com.company.policyrag.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class EmployeeBalanceRequest {

    @Min(0)
    private int casualLeaveUsed;

    @Min(0)
    private int casualLeaveTotal = 12;

    @Min(0)
    private int sickLeaveUsed;

    @Min(0)
    private int sickLeaveTotal = 10;

    @Min(0)
    private int earnedLeaveUsed;

    @Min(0)
    private int earnedLeaveTotal = 15;

    @DecimalMin("0.00")
    @NotNull
    private BigDecimal homeOfficeClaimed = BigDecimal.ZERO;

    @DecimalMin("0.00")
    @NotNull
    private BigDecimal homeOfficeLimit = new BigDecimal("500.00");

    @Min(0)
    @Max(100)
    private int securityScore = 100;

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
}
