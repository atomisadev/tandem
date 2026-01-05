import { Elysia } from "elysia";
import { StatusService } from "./status.service";

export const statusController = new Elysia({ prefix: "/status" })
  .get("/", () => StatusService.getSystemHealth())
  .get("/ping", () => "pong");
