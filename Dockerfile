FROM node:18.14.2-alpine3.17 AS pnpm-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g pnpm@latest-9
# RUN pnpm config set electron_mirror "https://npm.taobao.org/mirrors/electron/"

FROM pnpm-base AS base
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM pnpm-base AS arex
# runtime server
COPY --from=build /app/packages/arex-server/ /app/

# frontend build product
COPY --from=build /app/packages/arex/dist /app/dist

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
EXPOSE 8080
CMD [ "node", "./server.js",">","./logs/app.log","2>", "./logs/error.log"]
