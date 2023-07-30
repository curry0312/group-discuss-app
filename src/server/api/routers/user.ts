import { z } from "zod";
import {
  createTRPCRouter,
  privatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  //*Check whether the user is new or not in our database.
  checkUser: privatedProcedure.query(async ({ ctx }) => {
    //*if it's not new, just return the user.
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.currentUserId,
      },
    });
    //*Otherwise, make a new user in our database.
    if (!user) {
      const newUser = await ctx.prisma.user.create({
        data: { id: ctx.currentUserId, name: "user" },
      });
      return newUser;
    }
    return user;
  }),

  createUser: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newUser = await ctx.prisma.user.create({
        data: { id: input.id, name: input.name },
      });

      return newUser;
    }),
});
