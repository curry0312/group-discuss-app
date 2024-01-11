import { privatedProcedure } from "./../trpc";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  createComment: privatedProcedure
    .input(z.object({ content: z.string(), postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.create({
        data: {
          authorId: ctx.currentUserId,
          content: input.content,
          postId: input.postId,
        },
      });
    }),

  deleteComment: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAllPostComments: privatedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          id: input.postId,
        },
        select: {
          comments: {
            include: {
              author: true,
              likes: true,
            },
            orderBy: [{ createdAt: "desc" }],
          },
        },
      });
    }),
});
