FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend
COPY . .

# Vite dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]