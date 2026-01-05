import { Elysia } from "elysia";
import { statusController } from "./status/status.controller";
import { authController } from "./auth/auth.controller";

export const modules = new Elysia().use(statusController).use(authController);
