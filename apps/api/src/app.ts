import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { Logger } from "./common/logger";
import { config } from "./config";
import { modules } from "./modules";

export const createApp = () => {
  const app = new Elysia()
    .use(cors({ origin: config.cors.origin, credentials: true }))
    .derive(() => {
      return {
        startTime: process.hrtime(),
        config: config,
      };
    })
    .onAfterResponse(({ request, set, startTime }) => {
      const end = process.hrtime(startTime);
      const durationInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);
      Logger.http(
        request.method,
        request.url,
        (set.status as number) || 200,
        `${durationInMs}ms`,
      );
    })
    .onError(({ error, request, set }) => {
      Logger.error(`Request failed for ${request.url}`, error);
      set.status = (error as any).status || 500;
      return {
        status: "error",
        message: (error as any).message,
      };
    })
    .use(modules)
    .get("/", () => ({ name: config.app.name, version: config.app.version }))
    .get("/api/health", () => ({ status: "ok" }));

  return app;
};

export type App = ReturnType<typeof createApp>;
