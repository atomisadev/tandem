import { Elysia, t } from "elysia";
import { auth } from "../auth/auth";
import { prisma } from "../../common/db";

export const whitelistController = new Elysia({
  prefix: "/api/admin/whitelist",
})
  .onBeforeHandle(async ({ request, set }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "ADMIN") {
      set.status = 403;
      return "Forbidden";
    }
  })
  .get("/", async () => {
    return prisma.whitelist.findMany({
      orderBy: { createdAt: "desc" },
    });
  })
  .post("/", async ({ body, set }) => {
    const { email } = body as { email: string };

    const existing = await prisma.whitelist.findUnique({ where: { email } });
    if (existing) return existing;

    return prisma.whitelist.create({
      data: { email },
    });
  })
  .delete("/:email", async ({ params }) => {
    return prisma.whitelist.delete({
      where: { email: params.email },
    });
  });
