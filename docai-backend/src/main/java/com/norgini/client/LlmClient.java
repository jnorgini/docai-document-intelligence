package com.norgini.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.norgini.exception.AiIntegrationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class LlmClient {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${OPENROUTER_API_KEY:sem-chave}")
    private String apiKey;

    public LlmClient() {
        String baseUrl = "https://" + "openrouter.ai" + "/api/v1";
        this.restClient = RestClient.create(baseUrl);
        this.objectMapper = new ObjectMapper();
    }

    public String generateCompletion(String promptText) {
        try {
            Map<String, Object> body = Map.of(
                "model", "openrouter/free",
                "messages", List.of(
                    Map.of("role", "user", "content", promptText)
                ),
                "temperature", 0.2
            );

            String response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0)
                    .path("message").path("content").asText();
        } catch (Exception e) {
            throw new AiIntegrationException("Falha ao comunicar com o provedor de IA Generativa.", e);
        }
    }
    
}
