# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies including dev
RUN npm install

COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Run the bot
CMD ["node", "dist/index.js"]# Run the bot
CMD ["npm", "start"]
