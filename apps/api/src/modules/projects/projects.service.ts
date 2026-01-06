import { prisma } from "../../common/db";

export class ProjectsService {
  static async createProject(
    userId: string,
    data: { title: string; description?: string }
  ) {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
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
