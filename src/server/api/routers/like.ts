import { privatedProcedure } from "./../trpc";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({

  handleLikeAddToggle: privatedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.like.create({
        data: {
          postId: input.postId,
          userId: ctx.currentUserId,
        },
      });
    }),
  handleLikeDeleteToggle: privatedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.like.delete({
        where: {
          userId_postId: {
            userId: ctx.currentUserId,
            postId: input.postId,
          },
        }
      });
    }),
  isUserLikePost: privatedProcedure.input(z.object({ postId: z.string() })).query(
    async ({ ctx, input }) => {
      const like = await ctx.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: ctx.currentUserId,
            postId: input.postId,
          },
        },
      });
      if(!like) return false
      return true
    }
  )
});
