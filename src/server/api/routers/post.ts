import { privatedProcedure } from "./../trpc";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: privatedProcedure
    .input(z.object({ content: z.string(), groupId:z.string() }))
    .mutation(async({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data:{
          content: input.content,
          authorId: ctx.currentUserId,
          groupId: input.groupId
        }
      })
    }),

  getAllGroupPosts: privatedProcedure
    .input(z.object({ groupId: z.string()}))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          groupId:input.groupId
        },
        orderBy: [{ createdAt: "desc" }],
      })
    }),
});
