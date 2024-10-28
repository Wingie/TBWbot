FROM alpine:latest 
# Install Node.js and npm
RUN apk add --no-cache nodejs npm
COPY . /tbyw
WORKDIR /tbyw
COPY package*.json ./
RUN npm install
RUN npm install -g serve  
RUN npm run build  
EXPOSE 3000
CMD [ "serve", "-s", "dist" ]