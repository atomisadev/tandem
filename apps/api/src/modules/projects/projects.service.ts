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
}
