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
            post: {
              connect: {
                id: input.postId,
              },
            },
            user: {
              connect: {
                id: ctx.currentUserId,
              },
            },
          },
        });
      }
      if (input.commentId != null) {
        return await ctx.prisma.like.create({
          data: {
            comment: {
              connect: {
                id: input.commentId,
              },
            },
            user: {
              connect: {
                id: ctx.currentUserId,
              },
            },
          },
        });
      }
    }),
  handleLikeDeleteToggle: privatedProcedure
    .input(
      z.object({
        postId: z.string().nullable(),
        commentId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.postId != null) {
        return await ctx.prisma.like.delete({
          where: {
            userId_postId: {
              userId: ctx.currentUserId,
              postId: input.postId,
            },
          },
        });
      }
      if (input.commentId != null) {
        return await ctx.prisma.like.delete({
          where: {
            userId_commentId: {
              userId: ctx.currentUserId,
              commentId: input.commentId,
            },
          },
        });
      }
    }),

  // isUserLikePost: privatedProcedure
  //   .input(z.object({ postId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const like = await ctx.prisma.like.findFirst({
  //       where: {
  //         postId: input.postId,
  //         userId: ctx.currentUserId,
  //       },
  //     });
  //     if (!like) return false;
  //     return true;
  //   }),

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
