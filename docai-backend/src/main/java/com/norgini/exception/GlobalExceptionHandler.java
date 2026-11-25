package com.norgini.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.norgini.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DocumentProcessingException.class)
	public ResponseEntity<ErrorResponse> handleDocumentProcessing(DocumentProcessingException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Falha no processamento do documento", ex.getMessage(), request);
	}

	@ExceptionHandler(AiIntegrationException.class)
	public ResponseEntity<ErrorResponse> handleAiIntegration(AiIntegrationException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_GATEWAY, "Erro na integração com IA", ex.getMessage(), request);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ErrorResponse> handleMaxUploadSize(MaxUploadSizeExceededException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.CONTENT_TOO_LARGE, "Arquivo excede o limite",
				"O tamanho máximo permitido para o PDF é 10MB.", request);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFound(NoResourceFoundException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.NOT_FOUND, "Endpoint não encontrado", "A rota solicitada não existe nesta API.",
				request);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.METHOD_NOT_ALLOWED, "Método HTTP não permitido",
				"O método " + ex.getMethod() + " não é suportado para esta rota.", request);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno do servidor",
				"Ocorreu um erro inesperado ao processar a requisição.", request);
	}

	@ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationErrors(
			org.springframework.web.bind.MethodArgumentNotValidException ex, HttpServletRequest request) {
		String message = ex.getBindingResult().getFieldErrors().stream().map(error -> error.getDefaultMessage())
				.findFirst().orElse("Dados de entrada inválidos.");

		return buildResponse(HttpStatus.BAD_REQUEST, "Erro de validação", message, request);
	}

	private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String error, String message,
			HttpServletRequest request) {
		ErrorResponse body = new ErrorResponse(Instant.now(), status.value(), error, message, request.getRequestURI());
		return ResponseEntity.status(status).body(body);
	}

}
