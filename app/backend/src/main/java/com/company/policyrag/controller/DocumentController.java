package com.company.policyrag.controller;

import com.company.policyrag.service.DocumentIngestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
@Tag(name = "Document Management", description = "Ingest, parse, and embed policy documents into pgvector")
public class DocumentController {

    private final DocumentIngestionService ingestionService;

    public DocumentController(DocumentIngestionService ingestionService) {
        this.ingestionService = ingestionService;
    }

    @PostMapping("/sync-local-docs")
    @Operation(summary = "Sync all local policy documents", description = "Scans the specified folder for Markdown and PDF files, splits them into 500-token chunks, and embeds them into PostgreSQL pgvector.")
    @ApiResponse(responseCode = "200", description = "Local documents scanned and indexed")
    public ResponseEntity<Map<String, Object>> syncLocalDocs(
            @Parameter(description = "Folder path relative to project root containing policy files", example = "docs")
            @RequestParam(value = "path", defaultValue = "docs") String path) {
        Map<String, Integer> results = ingestionService.ingestDirectory(path);
        int totalChunks = results.values().stream().filter(c -> c > 0).mapToInt(Integer::intValue).sum();

        return ResponseEntity.ok(Map.of(
                "status", "completed",
                "folder", path,
                "total_chunks_indexed", totalChunks,
                "file_breakdown", results
        ));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload and index a policy file", description = "Uploads an individual PDF or Markdown document, extracts text with page numbers, and stores vectors into pgvector.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Document uploaded and indexed successfully"),
        @ApiResponse(responseCode = "400", description = "Uploaded file is empty"),
        @ApiResponse(responseCode = "500", description = "Failed to process document")
    })
    public ResponseEntity<Map<String, Object>> uploadAndIndexDocument(
            @Parameter(description = "Policy file (PDF, Markdown, or TXT)")
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || file.getOriginalFilename() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded file is empty"));
        }

        try {
            Path tempDir = Files.createTempDirectory("policy_upload_");
            File targetFile = new File(tempDir.toFile(), file.getOriginalFilename());
            try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                fos.write(file.getBytes());
            }

            int chunks = ingestionService.ingestFile(targetFile);
            targetFile.delete();

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "file", file.getOriginalFilename(),
                    "chunks_indexed", chunks
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to process document: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName())
            ));
        }
    }
}
