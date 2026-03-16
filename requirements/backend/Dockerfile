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

#generate prisma client
RUN npx prisma generate

# 6. Compile TypeScript to JavaScript -- 
# added ls to check if the dist/prisma/seed.js is succesfully created.. in the past it silently failed and used old build.
RUN npm run build && ls dist/src/main.js dist/prisma/seed.js 

# 7. install curl for health check
RUN apk add --no-cache curl

# 8. Expose the port Nest listens on (default 3000)
EXPOSE 3000

CMD ["/app/start.sh"]