FROM node:18
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY backendIndex.js ./
COPY backendpackage.json ./

# Create upload directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3841

# Start application
CMD ["node", "backendIndex.js"]
