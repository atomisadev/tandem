import { prisma } from "../../common/db";

export class ProjectsService {
  static async createProject(
    userId: string,
    data: {
      title: string;
      description?: string;
      githubRepoId: string;
      githubRepoName: string;
    }
  ) {
    const existing = await prisma.project.findFirst({
      where: { githubRepoId: data.githubRepoId },
    });

    if (existing) {
      throw new Error("Project already exists for this repository");
    }

    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        githubRepoId: data.githubRepoId,
        githubRepoName: data.githubRepoName,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
    });
  }

  static async getMyProjects(userId: string) {
    return prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  static async getProject(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }

  static async createTask(
    userId: string,
    projectId: string,
    data: { title: string; status: string }
  ) {
    const member = await prisma.member.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!member) {
      throw new Error("Unauthorized");
    }

    const lastTrack = await prisma.task.findFirst({
      where: { projectId, status: data.status },
    });

    const newOrder = lastTrack ? lastTrack.order + 1000 : 1000;

    return prisma.task.create({
      data: {
        title: data.title,
        status: data.status,
        projectId,
        order: newOrder,
      },
    });
  }

  static async updateTask(
    userId: string,
    taskId: string,
    data: {
      status?: string;
      order?: number;
      title?: string;
      description?: string;
      priority?: "low" | "medium" | "high";
      tags?: string[];
      githubBranch?: string | null;
      githubPrId?: number | null;
      githubPrStatus?: "open" | "merged" | "closed" | null;
    }
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new Error("Task not found");

    const member = await prisma.member.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: task.projectId,
        },
      },
    });

    if (!member) throw new Error("Unauthorized");

    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }
}
