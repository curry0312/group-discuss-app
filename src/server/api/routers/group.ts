import { z } from "zod";
import {
  createTRPCRouter,
  privatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
        },
      });
      return newGroup;
    }),
  getAllUserOwnerGroups: privatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany({
      where: { 
        ownerId: ctx.currentUserId,
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  }),
  getAllUserMemberGroups: privatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany({
      where: { 
        members: {
          some: {
            id: ctx.currentUserId,
          },
        }
      },
      orderBy: {
        createdAt: "desc",
      }
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
          }
        },
      });
    }),
});
