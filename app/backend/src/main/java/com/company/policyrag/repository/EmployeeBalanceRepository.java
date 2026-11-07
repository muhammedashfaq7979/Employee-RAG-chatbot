package com.company.policyrag.repository;

import com.company.policyrag.model.EmployeeBalance;
import com.company.policyrag.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeBalanceRepository extends JpaRepository<EmployeeBalance, UUID> {
    Optional<EmployeeBalance> findByUserId(UUID userId);
    Optional<EmployeeBalance> findByUser(User user);
}
