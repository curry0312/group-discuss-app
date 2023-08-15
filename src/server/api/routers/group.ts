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
          }
        },
      });
      return newGroup;
    }),
  getGroup: privatedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
        },
        include: {
          members: true,
        }
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
