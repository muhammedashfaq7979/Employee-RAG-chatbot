package com.company.policyrag.controller;

import com.company.policyrag.dto.ChatRequest;
import com.company.policyrag.dto.ChatResponse;
import com.company.policyrag.service.PolicyRagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
@Tag(name = "Policy RAG Chat", description = "Query company documents using Local Ollama (llama3.1:8b) and PostgreSQL pgvector")
public class ChatController {

    private final PolicyRagService ragService;

    public ChatController(PolicyRagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping
    @Operation(summary = "Ask a policy question", description = "Performs vector similarity search against PostgreSQL pgvector, constructs a grounded prompt, and calls local Ollama. Returns answer with source citations.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Query processed successfully", content = @Content(schema = @Schema(implementation = ChatResponse.class))),
        @ApiResponse(responseCode = "400", description = "Query text is empty")
    })
    public ResponseEntity<ChatResponse> askPolicyQuestion(@RequestBody ChatRequest request) {
        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("Query cannot be empty", null, false));
        }
        ChatResponse response = ragService.ask(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Stream policy answer in real-time", description = "Delivers tokens incrementally using Server-Sent Events (SSE) for low perceived latency on macOS Apple Silicon.")
    @ApiResponse(responseCode = "200", description = "Streaming SSE token connection opened")
    public Flux<String> streamPolicyQuestion(
            @Parameter(description = "Question to ask the policy assistant", example = "Can I carry forward unused sick leave?")
            @RequestParam("query") String query) {
        if (query == null || query.trim().isEmpty()) {
            return Flux.just("Query cannot be empty");
        }
        return ragService.streamAsk(query);
    }
}
