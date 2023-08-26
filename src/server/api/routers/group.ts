import { z } from "zod";
import { createTRPCRouter, privatedProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  createGroup: privatedProcedure
    .input(
      z.object({ name: z.string(), public: z.boolean(), image: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const newGroup = await ctx.prisma.group.create({
        data: {
          name: input.name,
          ownerId: ctx.currentUserId,
          public: input.public,
          image: input.image,
          members: {
            connect: {
              id: ctx.currentUserId,
            },
          },
        },
      });
      return newGroup;
    }),

  deleteGroup: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.group.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateGroup: privatedProcedure.input(z.object({ id: z.string(),name: z.string(), public: z.boolean(), image: z.string() })).mutation(
    async ({ ctx, input }) => {
      return await ctx.prisma.group.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          public: input.public,
          image: input.image,
        },
      });
    }
  ),

  getGroup: privatedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: true,
        },
      });
    }),

  getAllUserOwnerGroups: privatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany({
      where: {
        ownerId: ctx.currentUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllUserMemberGroups: privatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany({
      where: {
        members: {
          some: {
            id: ctx.currentUserId,
          },
        },
      },
      include: {
        members: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAllProfileUserPublicMemberGroups: privatedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findMany({
        where: {
          members: {
            some: {
              id: input.userId,
            },
          },
          public: true,
        },
        include: {
          members: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  inviteFriendToGroup: privatedProcedure
    .input(z.object({ id: z.string(), userIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.group.update({
        where: {
          id: input.id,
        },
        data: {
          members: {
            connect: input.userIds.map((userId) => ({
              id: userId,
            })),
          },
        },
      });
    }),
});
