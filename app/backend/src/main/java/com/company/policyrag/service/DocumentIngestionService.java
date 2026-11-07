package com.company.policyrag.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Service
public class DocumentIngestionService {

    private static final Logger log = LoggerFactory.getLogger(DocumentIngestionService.class);

    private final VectorStore vectorStore;
    private final TokenTextSplitter tokenTextSplitter;
    private final JdbcTemplate jdbcTemplate;

    public DocumentIngestionService(VectorStore vectorStore, JdbcTemplate jdbcTemplate) {
        this.vectorStore = vectorStore;
        this.jdbcTemplate = jdbcTemplate;
        this.tokenTextSplitter = new TokenTextSplitter(500, 100, 5, 5000, true);
    }

    public int ingestFile(File file) throws IOException {
        String filename = file.getName();
        log.info("Starting ingestion for file: {}", filename);

        List<Document> rawDocuments;
        if (filename.toLowerCase().endsWith(".pdf")) {
            Resource pdfResource = new FileSystemResource(file);
            PagePdfDocumentReader reader = new PagePdfDocumentReader(pdfResource);
            rawDocuments = reader.get();
        } else {
            String content = Files.readString(file.toPath());
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("source_file", filename);
            metadata.put("file_path", file.getAbsolutePath());
            rawDocuments = List.of(new Document(content, metadata));
        }

        List<Document> chunkedDocuments = tokenTextSplitter.apply(rawDocuments);

        for (int i = 0; i < chunkedDocuments.size(); i++) {
            Document doc = chunkedDocuments.get(i);
            Map<String, Object> meta = doc.getMetadata();
            meta.putIfAbsent("source_file", filename);
            meta.put("chunk_index", i);
            meta.put("chunk_id", filename + "_chunk_" + i);
            if (!meta.containsKey("page_number")) {
                meta.put("page_number", 1);
            }
        }

        // Delete any existing chunks for this file to prevent duplicates
        try {
            jdbcTemplate.update("DELETE FROM vector_store WHERE metadata->>'source_file' = ?", filename);
        } catch (Exception e) {
            log.warn("Could not remove previous chunks for {}: {}", filename, e.getMessage());
        }

        vectorStore.add(chunkedDocuments);
        log.info("Successfully ingested {} chunks for {}", chunkedDocuments.size(), filename);
        return chunkedDocuments.size();
    }

    public Map<String, Integer> ingestDirectory(String directoryPath) {
        Map<String, Integer> results = new LinkedHashMap<>();
        File folder = resolveFolder(directoryPath);
        if (!folder.exists() || !folder.isDirectory()) {
            log.warn("Directory does not exist: {}", directoryPath);
            return results;
        }

        File[] files = folder.listFiles((dir, name) -> {
            String lower = name.toLowerCase();
            return lower.endsWith(".pdf") || lower.endsWith(".md") || lower.endsWith(".txt");
        });

        if (files == null || files.length == 0) {
            log.info("No policy files found in: {}", directoryPath);
            return results;
        }

        for (File file : files) {
            try {
                int chunks = ingestFile(file);
                results.put(file.getName(), chunks);
            } catch (Exception e) {
                log.error("Failed to ingest file: " + file.getName(), e);
                results.put(file.getName(), -1);
            }
        }

        return results;
    }

    private File resolveFolder(String directoryPath) {
        File folder = new File(directoryPath);
        if (folder.exists() && folder.isDirectory()) {
            return folder;
        }
        File parentFolder = new File("../" + directoryPath);
        if (parentFolder.exists() && parentFolder.isDirectory()) {
            return parentFolder;
        }
        File grandParentFolder = new File("../../" + directoryPath);
        if (grandParentFolder.exists() && grandParentFolder.isDirectory()) {
            return grandParentFolder;
        }
        return folder;
    }
}
