# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the backend source code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]