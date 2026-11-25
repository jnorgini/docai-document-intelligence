package com.norgini.dto;

import java.util.List;

public record AnalysisResponse(
		String tituloDocumento, 
		String resumoExecutivo, 
		List<String> competenciasIdentificadas,
		List<String> pontosCriticos, 
		String textoExtraido
		) {
	
}
