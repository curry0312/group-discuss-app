import { z } from "zod";
import { createTRPCRouter, privatedProcedure, publicProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  createGroup: privatedProcedure
    .input(
      z.object({ name: z.string(), ownerId: z.string(), public: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      const newGroup = await ctx.prisma.group.create({
        data: {
          name: input.name,
          ownerId: ctx.currentUserId,
          public: input.public,
        },
      });
      return newGroup;
    }),
});
