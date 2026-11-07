package com.company.policyrag.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "Backend health status and documentation endpoint")
public class RootController {

    @GetMapping("/health")
    @Operation(summary = "Backend health status and documentation link")
    public ResponseEntity<Map<String, String>> getStatus() {
        Map<String, String> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("service", "employee-policy-backend");
        status.put("docs", "http://localhost:8000/api-docs");
        return ResponseEntity.ok(status);
    }
}
