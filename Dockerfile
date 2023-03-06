FROM node:18.14.2-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./
COPY . .

RUN npm install  --loglevel verbose --registry=http://registry.npmmirror.com
RUN npm run build --max_old_space_size=8192
RUN rm -rf node_modules
RUN cp ./deploy/deploy-package.json ./
RUN npm install  --loglevel verbose --registry=http://registry.npmmirror.com
# Bundle app event
# COPY . .

EXPOSE 8080
CMD [ "node", "server.js",">","./logs/app.log","2>", "./logs/error.log"]
