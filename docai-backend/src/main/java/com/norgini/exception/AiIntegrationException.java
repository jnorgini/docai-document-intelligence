package com.norgini.exception;

public class AiIntegrationException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public AiIntegrationException(String message) {
		super(message);
	}

	public AiIntegrationException(String message, Throwable cause) {
		super(message, cause);
	}

}
