# Use Node.js LTS
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only) - ignore scripts to skip build
RUN npm ci --omit=dev --ignore-scripts

# Copy pre-compiled code
COPY dist ./dist

# Run the bot
CMD ["node", "dist/index.js"]
