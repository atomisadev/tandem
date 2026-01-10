import { Elysia, t } from "elysia";
import { WaitlistService } from "./waitlist.service";

export const waitlistController = new Elysia({ prefix: "/api/waitlist" }).post(
  "/",
  async ({ body, set }) => {
    const { email } = body;

    try {
      await WaitlistService.addEmail(email);
      return { success: true, message: "Added to waitlist" };
    } catch (e) {
      set.status = 500;
      throw new Error("Internal server error");
    }
  },
  {
    body: t.Object({
      email: t.String(),
    }),
  }
);
