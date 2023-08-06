import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import {
  createTRPCRouter,
  privatedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  //*Check whether the user is new or not in our database.
  checkUser: privatedProcedure.query(async ({ ctx }) => {
    //*if it's not new, just return the user.
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.currentUserId,
      },
    });
    console.log(user);
    //*Otherwise, make a new user in our database.
    if (user) return user;
    const clerkUser = await clerkClient.users.getUser(ctx.currentUserId);
    if (clerkUser) {
      if (!clerkUser.username) {
        const newUser = await ctx.prisma.user.create({
          data: {
            id: ctx.currentUserId,
            name: `${clerkUser.lastName}${clerkUser.firstName}`,
            image: clerkUser.imageUrl,
          },
        });
        return newUser;
      } else {
        const newUser = await ctx.prisma.user.create({
          data: {
            id: ctx.currentUserId,
            name: clerkUser.username,
            image: clerkUser.imageUrl,
          },
        });
        return newUser;
      }
    }
  }),

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany();
    return allUsers;
  }),
});
