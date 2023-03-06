# 安装完整依赖并构建产物
FROM node:18.14.2-alpine3.17 AS build

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install  --loglevel verbose --registry=http://registry.npmmirror.com
RUN npm run build

FROM node:18.14.2-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./
COPY . .

COPY --from=build /usr/src/app/dist /usr/src/app/dist

RUN cp ./deploy/deploy-package.json ./package.json
RUN npm install  --loglevel verbose --registry=http://registry.npmmirror.com
# Bundle app event
# COPY . .

EXPOSE 8080
CMD [ "node", "server.js",">","./logs/app.log","2>", "./logs/error.log"]
