FROM node:18.16.0-alpine
WORKDIR /app
ENV MONGO_URI="mongodb+srv://sonu7524:23122000@cluster0.u9dyi7i.mongodb.net/livetvDB?retryWrites=true&w=majority"
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]