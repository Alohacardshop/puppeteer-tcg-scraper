FROM node:18-slim

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation libappindicator3-1 libasound2 \
  libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
  libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 \
  libxcomposite1 libxdamage1 libxrandr2 xdg-utils \
  wget ca-certificates \
  --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Puppeteer will use this Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
