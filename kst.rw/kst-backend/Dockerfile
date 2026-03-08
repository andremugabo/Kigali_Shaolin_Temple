FROM node:20-alpine

WORKDIR /app

# Install build dependencies for bcrypt/sharp if needed
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Add entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3005

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
