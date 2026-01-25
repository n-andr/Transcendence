# 1. Use official Node.js image (Linux)
FROM node:20-alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy package files first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the source code
COPY . .

# 6. Compile TypeScript to JavaScript
#RUN npm run build

# 7. Expose the port Nest listens on (default 3000)
EXPOSE 3000

CMD ["npm", "run", "start:dev"]