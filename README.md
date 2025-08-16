---
title: RAG Chat
emoji: 🤖
colorFrom: blue
colorTo: red
sdk: docker
pinned: false
license: apache-2.0
short_description: A RAG-powered chat application for document Q&A
---

# RAG Chat Application

A Retrieval-Augmented Generation (RAG) chat application that allows users to upload documents and ask questions about their content.

## Features

- **Document Upload**: Support for PDF
- **Intelligent Q&A**: Ask questions about your uploaded documents
- **Vector Search**: Uses embeddings for semantic document retrieval
- **Chat Interface**: Interactive chat interface for seamless user experience

## How it Works

1. **Upload Documents**: Upload your documents through the web interface
2. **Document Processing**: Documents are processed and converted to embeddings
3. **Ask Questions**: Type your questions about the document content
4. **Get Answers**: Receive contextually relevant answers based on your documents

## Technology Stack

- **Backend**: FastAPI/Python
- **Frontend**: React
- **AI/ML**: LangChain, OpenAI, Sentence Transformers
- **Vector Database**: ChromaDB
- **Document Processing**: PyPDF2

## Configuration

Set up your environment variables:
- `GROQ_API_KEY`: Your OpenAI API key
- `MODEL_NAME`: The model to use (default: meta-llama/llama-4-scout-17b-16e-instruct)

## Usage

1. Start the application
2. Upload your documents using the file upload interface
3. Wait for the documents to be processed
4. Start asking questions about your documents
5. Receive AI-powered answers based on the document content

## API Endpoints

- `POST /upload`: Upload documents
- `POST /generate`: Send chat messages

---

Built with ❤️ using LangChain and GROQ