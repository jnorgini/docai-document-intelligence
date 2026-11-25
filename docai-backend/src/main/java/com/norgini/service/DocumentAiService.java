package com.norgini.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.norgini.client.LlmClient;
import com.norgini.dto.AnalysisResponse;
import com.norgini.dto.ChatRequest;
import com.norgini.dto.ChatResponse;
import com.norgini.exception.AiIntegrationException;
import com.norgini.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentAiService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final String MARKDOWN_FENCE_REGEX = "(?s)^```(?:json)?\\s*|\\s*```$";

    private final PdfExtractorService pdfExtractor;
    private final LlmClient llmClient;

    public DocumentAiService(PdfExtractorService pdfExtractor, LlmClient llmClient) {
        this.pdfExtractor = pdfExtractor;
        this.llmClient = llmClient;
    }

    public AnalysisResponse analyzePdf(MultipartFile file) {
        String extractedText = pdfExtractor.extractText(file);
        String prompt = PromptTemplate.DOCUMENT_ANALYSIS.renderAnalysis(extractedText);
        String aiRawResponse = llmClient.generateCompletion(prompt);

        AnalysisResponse structured = parseStructuredResponse(aiRawResponse);

        return new AnalysisResponse(
                structured.tituloDocumento(),
                structured.resumoExecutivo(),
                structured.competenciasIdentificadas(),
                structured.pontosCriticos(),
                extractedText
        );
    }

    public ChatResponse chatWithDocument(ChatRequest request) {
        String prompt = PromptTemplate.DOCUMENT_CHAT.renderChat(request.documentText(), request.question());
        String answer = llmClient.generateCompletion(prompt);

        return new ChatResponse(answer);
    }

    private AnalysisResponse parseStructuredResponse(String rawResponse) {
        try {
            String sanitizedJson = rawResponse.replaceAll(MARKDOWN_FENCE_REGEX, "").trim();
            return MAPPER.readValue(sanitizedJson, AnalysisResponse.class);
        } catch (JsonProcessingException e) {
            throw new AiIntegrationException("A resposta retornada pela IA não pôde ser estruturada.", e);
        }
    }
    
}
