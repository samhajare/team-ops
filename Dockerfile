# --- Base stage ---
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --development
COPY . .
RUN npm run build

# --- Development stage ---
FROM base AS development
ENV NODE_ENV=development
RUN npm install
CMD npm run migration:run && npm run start:dev

# --- Production stage ---
FROM base AS production
ENV NODE_ENV=production
CMD npm run migration:run
CMD ["node", "dist/main.js"]