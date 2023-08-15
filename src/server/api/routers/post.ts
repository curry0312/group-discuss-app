import { privatedProcedure } from "./../trpc";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { notEqual } from "assert";

export const postRouter = createTRPCRouter({
  createPost: privatedProcedure
    .input(z.object({ content: z.string(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.currentUserId,
          groupId: input.groupId,
        },
      });
    }),

  getPost: privatedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
        },
        include: {
          author: true,
          likes: true,
        },
      });
    }),

  getAllGroupPosts: privatedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          groupId: input.groupId,
        },
        include: {
          author: true,
          likes: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }),

  getAllUserPosts: privatedProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          authorId: input.authorId,
        },
        include: {
          author: true,
          likes: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }),
  getAllUserRelativePosts: privatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      where: {
        authorId:{
          not: ctx.currentUserId
        },
        group:{
          members: {
            some: {
              id: ctx.currentUserId,
            },
          },
        }
      },
      include: {
        author: true,
        likes: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  })
});
