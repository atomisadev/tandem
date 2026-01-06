import { Elysia, t } from "elysia";
import { auth } from "../auth/auth";
import { GithubService } from "./github.service";

export const githubController = new Elysia({ prefix: "/api/github" })
  .get("/owners", async ({ request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    return GithubService.getOwners(session.user.id);
  })
  .get("/repos/:owner", async ({ request, params, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    return GithubService.getRepos(session.user.id, params.owner);
  });
