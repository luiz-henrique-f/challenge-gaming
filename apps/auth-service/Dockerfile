FROM node:20-slim as development
 
WORKDIR /usr/src/app
 
# Copy root package.json and lockfile
COPY package.json ./
COPY package-lock.json ./
 
# Copy the api package.json
COPY apps/auth-service/package.json ./apps/auth-service/package.json
 
RUN npm install
 
# Copy app source
COPY . .

EXPOSE 3002
 
CMD ["npm", "run", "dev"]