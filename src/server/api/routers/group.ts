import { z } from "zod";
import { createTRPCRouter, privatedProcedure, publicProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  createGroup: privatedProcedure
    .input(
      z.object({ name: z.string(), public: z.boolean(), image:z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const newGroup = await ctx.prisma.group.create({
        data: {
          name: input.name,
          ownerId: ctx.currentUserId,
          public: input.public,
          image: input.image
        },
      });
      return newGroup;
    }),
    getAllUserGroups: privatedProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.group.findMany({
        where:{ownerId: ctx.currentUserId},
        take: 10
      });
    })
});
