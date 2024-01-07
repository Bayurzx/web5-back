# Use a minimal base image like Alpine Linux
FROM node:20.10.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application files to the container
COPY . .

# Expose the port your app runs on (adjust if necessary)
EXPOSE 3002

# Define the command to run your Node.js application
CMD ["node", "app.js"]
