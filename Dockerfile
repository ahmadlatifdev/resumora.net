# resumora.net — Vite + React static site (not Next.js)
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Run stage — serve Vite dist/ on port 8080 (Cloud Run / App Runner / Railway)
FROM node:20-alpine AS run

WORKDIR /app

RUN npm install -g serve@14

COPY --from=build /app/dist ./dist

EXPOSE 8080

# -s = SPA fallback for react-router; -l = listen port
CMD ["serve", "-s", "dist", "-l", "8080"]
