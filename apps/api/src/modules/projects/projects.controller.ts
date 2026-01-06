import { Elysia, t } from "elysia";
import { auth } from "../auth/auth";
import { ProjectsService } from "./projects.service";

export const projectsController = new Elysia({ prefix: "/api/projects" })
  .get("/", async ({ request, set }) => {
    const session = await auth.api.getSession({ 
        headers: request.headers 
    });
    
    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }
    return ProjectsService.getMyProjects(session.user.id);
  })
  .post("/", async ({ request, body, set }) => {
    const session = await auth.api.getSession({ 
        headers: request.headers 
    });

    if (!session) {
      set.status = 401;
      return "Unauthorized";
    }

    const { title, description } = body as {
      title: string;
      description?: string;
    };

    if (!title) {
      set.status = 400;
      return "Title is required";
    }

    return ProjectsService.createProject(session.user.id, {
      title,
      description,
    });
  });