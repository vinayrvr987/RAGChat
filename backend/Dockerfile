# ---- Build FastAPI backend ----
FROM python:3.11-slim

WORKDIR /app

# Create a cache folder for Hugging Face
RUN mkdir -p /app/hf_cache

# Install FastAPI and other backend dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Command to run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]