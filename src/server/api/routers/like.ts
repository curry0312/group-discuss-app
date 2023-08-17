import { privatedProcedure } from "./../trpc";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({
  handleLikeAddToggle: privatedProcedure
    .input(
      z.object({
        postId: z.string().nullable(),
        commentId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.postId != null) {
        return await ctx.prisma.like.create({
          data: {
            postId: input.postId,
            userId: ctx.currentUserId,
          },
        });
      }
      if (input.commentId != null) {
        return await ctx.prisma.like.create({
          data: {
            commentId: input.commentId,
            userId: ctx.currentUserId,
          },
        });
      }
    }),
  handleLikeDeleteToggle: privatedProcedure
    .input(
      z.object({
        id: z.string(),
        postId: z.string().nullable(),
        commentId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.postId != null) {
        return await ctx.prisma.like.delete({
          where: {
            id: input.id,
          },
        });
      }
      if (input.commentId != null) {
        return await ctx.prisma.like.delete({
          where: {
           id:  input.id,
          },
        });
      }
    }),
    
  isUserLikePost: privatedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const like = await ctx.prisma.like.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.currentUserId,
        },
      });
      if (!like) return false;
      return true;
    }),
  isUserLikeComment: privatedProcedure
    .input(z.object({ commentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const like = await ctx.prisma.like.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.currentUserId,
        },
      });
      if (!like) return false;
      return true;
    }),
});
