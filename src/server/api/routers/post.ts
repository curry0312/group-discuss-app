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

  deletePost: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.delete({
        where: {
          id: input.id,
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
          likes: {
            where: {
              userId: ctx.currentUserId,
            },
            select: {
              userId: true,
            }
          },
          comments: {
            include: {
              likes: true,
              author: true,
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            }
          }
        },
        
      });
    }),

  getAllGroupPosts: privatedProcedure
    .input(z.object({ groupId: z.string(), limit: z.number(), skip: z.number().optional() , cursor: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const posts =  await ctx.prisma.post.findMany({
        take: input.limit + 1,
        skip: input.skip,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          groupId: input.groupId,
        },
        include: {
          author: true,
          likes: true,
          comments: true,
          group: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (posts.length > input.limit) {
        const nextItem = posts.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),

  getAllUserInPublicGroupsPosts: privatedProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          authorId: input.authorId,
          group: {
            public: true,
          }
        },
        include: {
          author: true,
          likes: true,
          comments: true,
          group: true,
        },
        orderBy: [{ createdAt: "desc" }],
      });
    }),
  //*Get all the posts from groups which current user have joined, except user itself.
  getCurrentUserAllRelativePosts: privatedProcedure.input(z.object({ limit: z.number(), skip: z.number().optional() , cursor: z.string().nullish() })).query(async ({ ctx, input }) => {
    const posts =  await ctx.prisma.post.findMany({
      take: input.limit + 1,
      skip: input.skip,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      where: {
        authorId: {
          not: ctx.currentUserId,
        },
        group: {
          members: {
            some: {
              id: ctx.currentUserId,
            },
          },
        },
      },
      include: {
        author: true,
        likes: true,
        comments: true,
        group: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });
    let nextCursor: typeof input.cursor | undefined = undefined;
    if (posts.length > input.limit) {
      const nextItem = posts.pop(); // return the last item from the array
      nextCursor = nextItem?.id;
    }
    return {
      posts,
      nextCursor,
    }
  }),
});
