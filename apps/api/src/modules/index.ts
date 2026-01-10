import { Elysia } from "elysia";
import { statusController } from "./status/status.controller";
import { authController } from "./auth/auth.controller";
import { projectsController } from "./projects/projects.controller";
import { githubController } from "./github/github.controller";
import { waitlistController } from "./waitlist/waitlist.controller";
import { whitelistController } from "./admin/whitelist.controller";

export const modules = new Elysia()
  .use(statusController)
  .use(authController)
  .use(projectsController)
  .use(githubController)
  .use(waitlistController)
  .use(whitelistController);
