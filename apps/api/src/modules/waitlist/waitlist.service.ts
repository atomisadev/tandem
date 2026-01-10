import { prisma } from "../../common/db";

export class WaitlistService {
  static async addEmail(email: string) {
    return prisma.waitlist.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  }
}
