package com.company.policyrag.service;

import com.company.policyrag.dto.ChatRequest;
import com.company.policyrag.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PolicyRagService {

    private static final Logger log = LoggerFactory.getLogger(PolicyRagService.class);

    private static final String SYSTEM_PROMPT_TEMPLATE = """
        You are an official ACME Corp Employee Policy assistant.
        Your task is to answer employee questions strictly and exclusively using the verified policy excerpts provided below.
        
        Strict Guidelines:
        1. Base your answer ONLY on the provided excerpts.
        2. If the excerpts do not contain the answer, reply EXACTLY with:
           "I cannot find this information in the official policy documents. Please contact HR or IT directly."
        3. Do NOT invent, assume, or extrapolate policies.
        4. For each fact or rule mentioned, clearly state which document and section/page it came from.
        5. Keep responses professional, clear, and concise.

        [VERIFIED POLICY EXCERPTS]:
        %s
        """;

    private static final String FALLBACK_MESSAGE = 
        "I cannot find this information in the official policy documents. Please contact HR or IT directly.";

    private final VectorStore vectorStore;
    private final ChatModel chatModel;

    public PolicyRagService(VectorStore vectorStore, ChatModel chatModel) {
        this.vectorStore = vectorStore;
        this.chatModel = chatModel;
    }

    public ChatResponse ask(ChatRequest request) {
        String query = request.getQuery();
        log.info("Processing policy query: '{}'", query);

        SearchRequest searchRequest = SearchRequest.query(query)
                .withTopK(Math.max(request.getTopK() * 2, 8))
                .withSimilarityThreshold(request.getSimilarityThreshold());

        List<Document> rawDocs = vectorStore.similaritySearch(searchRequest);

        // Deduplicate chunks so identical copies never crowd out distinct policy sections
        Map<String, Document> uniqueDocs = new LinkedHashMap<>();
        for (Document doc : rawDocs) {
            String key = String.valueOf(doc.getMetadata().getOrDefault("chunk_id", doc.getContent()));
            uniqueDocs.putIfAbsent(key, doc);
            if (uniqueDocs.size() >= request.getTopK()) {
                break;
            }
        }
        List<Document> relevantDocs = new ArrayList<>(uniqueDocs.values());

        if (relevantDocs.isEmpty()) {
            log.info("No matching policy chunks passed similarity threshold ({}) for query: '{}'", 
                     request.getSimilarityThreshold(), query);
            return new ChatResponse(FALLBACK_MESSAGE, List.of(), false);
        }

        String contextBlock = formatContext(relevantDocs);
        SystemMessage systemMessage = new SystemMessage(String.format(SYSTEM_PROMPT_TEMPLATE, contextBlock));
        UserMessage userMessage = new UserMessage(query);
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        org.springframework.ai.chat.model.ChatResponse response = chatModel.call(prompt);
        String answer = response.getResult().getOutput().getContent();
        List<ChatResponse.Citation> citations = extractCitations(relevantDocs);

        return new ChatResponse(answer, citations, true);
    }

    public Flux<String> streamAsk(String query) {
        log.info("Streaming policy query: '{}'", query);

        SearchRequest searchRequest = SearchRequest.query(query)
                .withTopK(8)
                .withSimilarityThreshold(0.40);

        List<Document> rawDocs = vectorStore.similaritySearch(searchRequest);
        Map<String, Document> uniqueDocs = new LinkedHashMap<>();
        for (Document doc : rawDocs) {
            String key = String.valueOf(doc.getMetadata().getOrDefault("chunk_id", doc.getContent()));
            uniqueDocs.putIfAbsent(key, doc);
            if (uniqueDocs.size() >= 4) {
                break;
            }
        }
        List<Document> relevantDocs = new ArrayList<>(uniqueDocs.values());

        if (relevantDocs.isEmpty()) {
            return Flux.just(FALLBACK_MESSAGE);
        }

        String contextBlock = formatContext(relevantDocs);
        SystemMessage systemMessage = new SystemMessage(String.format(SYSTEM_PROMPT_TEMPLATE, contextBlock));
        UserMessage userMessage = new UserMessage(query);
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        return chatModel.stream(prompt)
                .map(chunk -> {
                    if (chunk.getResult() != null && chunk.getResult().getOutput() != null) {
                        String text = chunk.getResult().getOutput().getContent();
                        return text != null ? text : "";
                    }
                    return "";
                });
    }

    private String formatContext(List<Document> docs) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < docs.size(); i++) {
            Document doc = docs.get(i);
            String source = String.valueOf(doc.getMetadata().getOrDefault("source_file", "Unknown"));
            Object page = doc.getMetadata().getOrDefault("page_number", "N/A");
            sb.append(String.format("--- EXCERPT #%d [Source: %s, Page: %s] ---\n", i + 1, source, page));
            sb.append(doc.getContent().trim());
            sb.append("\n\n");
        }
        return sb.toString();
    }

    private List<ChatResponse.Citation> extractCitations(List<Document> docs) {
        List<ChatResponse.Citation> citations = new ArrayList<>();
        for (Document doc : docs) {
            String source = String.valueOf(doc.getMetadata().getOrDefault("source_file", "Policy Document"));
            Object page = doc.getMetadata().getOrDefault("page_number", 1);
            String content = doc.getContent();
            String snippet = content.length() > 200 ? content.substring(0, 200) + "..." : content;
            citations.add(new ChatResponse.Citation(source, page, snippet));
        }
        return citations;
    }
}
