FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM node:20-slim AS arex
# runtime server
COPY --from=build /app/packages/arex-server/ /app/

# frontend build product
COPY --from=build /app/packages/arex/dist /app/dist

WORKDIR /app
RUN npm i
EXPOSE 8080
CMD [ "node", "./server.js",">","./logs/app.log","2>", "./logs/error.log"]
