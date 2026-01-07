import { Elysia, t } from "elysia";
import { auth } from "../auth/auth";
import { ProjectsService } from "./projects.service";

export const projectsController = new Elysia({ prefix: "/api/projects" })
  .get("/", async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }
    return ProjectsService.getMyProjects(session.user.id);
  })
  .get("/:id", async ({ request, params, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }

    try {
      return await ProjectsService.getProject(session.user.id, params.id);
    } catch (e: any) {
      if (e.message === "Project not found") {
        set.status = 404;
        return e.message;
      }
      throw e;
    }
  })
  .post("/", async ({ request, body, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }

    const { title, description, githubRepoId, githubRepoName } = body as {
      title: string;
      description?: string;
      githubRepoId: string;
      githubRepoName: string;
    };

    if (!title) {
      set.status = 400;
      return "Title is required";
    }

    if (!githubRepoId || !githubRepoName) {
      set.status = 400;
      return "Github Repository is required";
    }

    try {
      return await ProjectsService.createProject(session.user.id, {
        title,
        description,
        githubRepoId,
        githubRepoName,
      });
    } catch (e: any) {
      // TODO: bad practice but let's keep it for now :(
      if (e.message === "Project already exists for this repository") {
        set.status = 409;
        return e.message;
      }
      throw e;
    }
  });
