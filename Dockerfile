FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Create upload directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "index.js"]
