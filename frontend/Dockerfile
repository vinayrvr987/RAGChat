# ---- Build React frontend ----
FROM node:20-alpine AS frontend-build

FROM node:18
WORKDIR /app

# Copy project files
COPY . .

# Install deps and build
RUN npm install && npm run build

# Serve build on port 7860
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "7860"]
