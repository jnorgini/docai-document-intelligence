package com.norgini.service;

import com.norgini.exception.DocumentProcessingException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfExtractorService {

    private static final int MAX_TEXT_LENGTH = 15_000;

    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new DocumentProcessingException("Nenhum arquivo PDF foi enviado.");
        }

        String rawText;
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            rawText = stripper.getText(document);
        } catch (IOException e) {
            throw new DocumentProcessingException("Não foi possível ler o arquivo PDF. Verifique se é um arquivo válido.", e);
        }

        if (rawText == null || rawText.isBlank()) {
            throw new DocumentProcessingException("O PDF enviado não contém texto selecionável para análise.");
        }

        return rawText.length() > MAX_TEXT_LENGTH
                ? rawText.substring(0, MAX_TEXT_LENGTH)
                : rawText;
    }
    
}
