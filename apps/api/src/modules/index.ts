import { Elysia } from "elysia";
import { statusController } from "./status/status.controller";
import { authController } from "./auth/auth.controller";
import { projectsController } from "./projects/projects.controller";

export const modules = new Elysia()
  .use(statusController)
  .use(authController)
  .use(projectsController);
