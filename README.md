# DocAI – Document Intelligence Platform

AI-powered PDF analysis and contextual chat built with **Java 21**, **Spring Boot**, **React**, **TypeScript**, and **LLMs**.

## Overview

DocAI automates document understanding in two steps:
1. **Structured Extraction:** Parses uploaded PDF files using Apache PDFBox and leverages Large Language Models (via OpenAI-compatible APIs) with structured prompt engineering to extract the document title, executive summary, identified competencies, and critical highlights.
2. **Contextual Assistant:** Enables real-time Q&A grounded strictly on the extracted document content to prevent hallucinations.

## Architecture & Tech Stack

### Backend (`docai-backend/`)
- **Core:** Java 21, Spring Boot 4 (WebMVC, RestClient, Validation)
- **PDF Processing:** Apache PDFBox 3.0
- **AI Integration:** OpenRouter / OpenAI-compatible LLM integration with typed prompt templates (`PromptTemplate`)
- **Error Handling & Security:** Centralized `@RestControllerAdvice` (`GlobalExceptionHandler`) with standardized `ErrorResponse` DTOs (`400`, `404`, `405`, `413`, `500`, `502`) and global CORS policy
- **Deployment:** Multi-stage Docker build (Eclipse Temurin 21 Alpine)

### Frontend (`docai-frontend/`)
- **Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **Structure:** Modular separation across `components/`, `services/`, and `types/`

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/documents/ping` | API health check |
| `POST` | `/api/documents/analyze` | Accepts a `.pdf` (`multipart/form-data`, field `file`) and returns structured JSON analysis |
| `POST` | `/api/documents/chat` | Accepts `{ "documentText": "...", "question": "..." }` and answers based solely on the document |

## Running Locally

### 1. Backend
```bash
cd docai-backend
export OPENROUTER_API_KEY=your_api_key_here
./mvnw spring-boot:run
```

### 2. Frontend
```bash
cd docai-frontend
cp .env.example .env
npm install
npm run dev
```
