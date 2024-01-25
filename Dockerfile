# Use a minimal base image like Alpine Linux
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set permissions for the logs directory
RUN chgrp -R 0 /usr/src/app && \
    chmod -R g=u /usr/src/app
    
# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port your app runs on (adjust if necessary)
EXPOSE 3002

# Define the command to run your Node.js application
CMD ["node", "index.js"]
