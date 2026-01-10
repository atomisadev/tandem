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
  .post(
    "/",
    async ({ request, body, set }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        set.status = 401;
        return "Unauthorized";
      }

      const { title, description, githubRepoId, githubRepoName } = body;

      try {
        return await ProjectsService.createProject(session.user.id, {
          title,
          description,
          githubRepoId,
          githubRepoName,
        });
      } catch (e: any) {
        if (e.message === "Project already exists for this repository") {
          set.status = 409;
          return e.message;
        }
        throw e;
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        githubRepoId: t.String(),
        githubRepoName: t.String(),
      }),
    }
  )
  .post("/:id/tasks", async ({ request, params, body, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }

    const { title, status } = body as { title: string; status: string };

    if (!title) {
      set.status = 400;
      return "Title is required";
    }

    return ProjectsService.createTask(session.user.id, params.id, {
      title,
      status: status || "todo",
    });
  })
  .patch("/tasks/:taskId", async ({ request, params, body, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }

    const updateData = body as {
      status?: string;
      order?: number;
      title?: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      tags?: string[];
      githubBranch?: string | null;
      githubPrId?: number | null;
      githubPrStatus?: "open" | "merged" | "closed" | null;
    };

    return ProjectsService.updateTask(
      session.user.id,
      params.taskId,
      updateData
    );
  });
