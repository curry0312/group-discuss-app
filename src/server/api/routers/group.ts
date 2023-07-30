import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  createGroup: publicProcedure
    .input(
      z.object({ name: z.string(), ownerId: z.string(), public: z.boolean() })
    )
    .mutation(async ({ ctx, input }) => {
      const newGroup = await ctx.prisma.group.create({
        data: {
          name: input.name,
          ownerId: input.ownerId,
          public: input.public,
        },
      });
      return newGroup;
    }),
});
