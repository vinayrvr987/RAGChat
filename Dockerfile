# ---- Build React frontend ----
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files and install deps
COPY frontend/package*.json ./
RUN npm install

# Copy all frontend source files
COPY frontend/ ./
RUN npm run build

# ---- Build FastAPI backend ----
FROM python:3.11-slim

WORKDIR /app

# Install FastAPI and other backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy React build into backend static folder
COPY --from=frontend-build /app/frontend/dist ./frontend_build


# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Command to run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
