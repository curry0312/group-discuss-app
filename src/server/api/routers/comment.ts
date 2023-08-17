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
            comments:{
              include:{
                author:true,
                likes:true,
              }
            }
        }
      });
    }),

  //   getAllGroupPosts: privatedProcedure
  //     .input(z.object({ groupId: z.string() }))
  //     .query(async ({ ctx, input }) => {
  //       return await ctx.prisma.post.findMany({
  //         where: {
  //           groupId: input.groupId,
  //         },
  //         include: {
  //           author: true,
  //           likes: true,
  //         },
  //         orderBy: [{ createdAt: "desc" }],
  //       });
  //     }),

  //   getAllUserPosts: privatedProcedure
  //     .input(z.object({ authorId: z.string() }))
  //     .query(async ({ ctx, input }) => {
  //       return await ctx.prisma.post.findMany({
  //         where: {
  //           authorId: input.authorId,
  //         },
  //         include: {
  //           author: true,
  //           likes: true,
  //         },
  //         orderBy: [{ createdAt: "desc" }],
  //       });
  //     }),
  //   getAllUserRelativePosts: privatedProcedure.query(async ({ ctx }) => {
  //     return await ctx.prisma.post.findMany({
  //       where: {
  //         authorId: {
  //           not: ctx.currentUserId,
  //         },
  //         group: {
  //           members: {
  //             some: {
  //               id: ctx.currentUserId,
  //             },
  //           },
  //         },
  //       },
  //       include: {
  //         author: true,
  //         likes: true,
  //       },
  //       orderBy: [{ createdAt: "desc" }],
  //     });
  //   }),
});
