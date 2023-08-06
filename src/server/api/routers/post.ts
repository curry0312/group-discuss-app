import { privatedProcedure } from "./../trpc";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";

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
        include:{
          likes: true
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
        include:{
          likes: true
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }),

  // getSpecificPostLikes: privatedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     return await ctx.prisma.post.findUnique({
  //       where: {
  //         id: input.id,
  //       },
  //       select:{
  //         likes: true
  //       }
  //     });
  //   }),
});
