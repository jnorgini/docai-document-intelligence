package com.norgini.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
		@NotBlank(message = "O contexto do documento é obrigatório para iniciar o chat.") 
		String documentText,

		@NotBlank(message = "A pergunta não pode estar vazia.") 
		String question) {
}
