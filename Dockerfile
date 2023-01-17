# Base Image
FROM node:17.7.1-alpine

# Update System
RUN apk update

# Switch Context
WORKDIR /app

# Copy Script
COPY ./src /app/

# Install node dependencies
RUN npm install

# Run app
ENTRYPOINT ["node", "index.js"]
