package com.norgini.prompt;

public enum PromptTemplate {

    DOCUMENT_ANALYSIS("""
        Analise o documento abaixo e responda EXCLUSIVAMENTE com um JSON válido (sem markdown, sem ```json), seguindo exatamente esta estrutura:
        {
          "tituloDocumento": "título curto do documento",
          "resumoExecutivo": "resumo objetivo em até 3 frases",
          "competenciasIdentificadas": ["item 1", "item 2"],
          "pontosCriticos": ["ponto 1", "ponto 2"]
        }

        Documento:
        {{document}}
        """),

    DOCUMENT_CHAT("""
        Você é um assistente especialista em análise documental.
        Responda à pergunta do usuário utilizando EXCLUSIVAMENTE as informações contidas no documento fornecido abaixo.
        Se a resposta não estiver no documento, diga claramente que essa informação não consta no texto analisado.

        Documento:
        {{document}}

        Pergunta: {{question}}
        """);

    private final String template;

    PromptTemplate(String template) {
        this.template = template;
    }

    public String renderAnalysis(String documentText) {
        return template.replace("{{document}}", documentText);
    }

    public String renderChat(String documentText, String question) {
        return template
                .replace("{{document}}", documentText)
                .replace("{{question}}", question);
    }
    
}
