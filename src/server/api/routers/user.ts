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
            bio: "",
          },
        });
        return newUser;
      } else {
        const newUser = await ctx.prisma.user.create({
          data: {
            id: ctx.currentUserId,
            name: clerkUser.username,
            image: clerkUser.imageUrl,
            bio: "",
          },
        });
        return newUser;
      }
    }
  }),

  getCurrentUser: privatedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.currentUserId,
      },
    });
    return user;
  }),

  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          friends: true,
          friendsOf: true,
        },
      });
    }),

  updateUser: privatedProcedure.input(z.object({ username: z.string(),bio: z.string(),image: z.string() })).mutation(
    async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.currentUserId,
        },
        data: {
          name: input.username,
          bio: input.bio,
          image: input.image
        },
      });
    }
  ),

  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.prisma.user.findMany();
    return allUsers;
  }),

  getAllFriends: privatedProcedure.query(async ({ ctx }) => {
    const friends = await ctx.prisma.user.findMany({
      where: {
        id: ctx.currentUserId,
      },
      select: {
        friends: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return friends;
  }),
  getAllUnGroupedFriends: privatedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const friends = await ctx.prisma.user.findMany({
        where: {
          id: ctx.currentUserId,
        },
        select: {
          friends: {
            where: {
              memberGroups: {
                none: {
                  id: input.groupId,
                },
              }
            },
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return friends;
    }),

  getAllFriendsOf: privatedProcedure.query(async ({ ctx }) => {
    const friendsOf = await ctx.prisma.user.findMany({
      where: {
        id: ctx.currentUserId,
      },
      select: {
        friendsOf: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return friendsOf;
  }),
  getAllUnGroupedFriendsOf: privatedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const friendsOf = await ctx.prisma.user.findMany({
        where: {
          id: ctx.currentUserId,
        },
        select: {
          friendsOf: {
            where: {
              memberGroups: {
                none: {
                  id: input.groupId,
                },
              }
            },
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return friendsOf;
    }),

  getAllUnCheckedFriends: privatedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      where: {
        id: ctx.currentUserId,
      },
      select: {
        unCheckedFriends: true,
      },
    });
  }),

  isInUncheckedRelationship: privatedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const unCheckedFriend = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.currentUserId,
          unCheckedFriends: {
            some: {
              id: input.id,
            },
          },
        },
      });
      const unCheckedFriendOf = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.currentUserId,
          unCheckedFriendsOf: {
            some: {
              id: input.id,
            },
          },
        },
      });
      if (unCheckedFriend || unCheckedFriendOf) return true;
      return false;
    }),

  isCurrentUserUncheckedFriend: privatedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const isCurrentUserUncheckedFriendOf = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.currentUserId,
          unCheckedFriends: {
            some: {
              id: input.id,
            },
          },
        },
      });
      if (!isCurrentUserUncheckedFriendOf) return true;
      return false;
    }),

  isInFriendRelationship: privatedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const friend = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.currentUserId,
          friends: {
            some: {
              id: input.id,
            },
          },
        },
      });
      const friendOf = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.currentUserId,
          friendsOf: {
            some: {
              id: input.id,
            },
          },
        },
      });
      if (friend || friendOf) return true;
      return false;
    }),

  addUnCheckedFriend: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          unCheckedFriends: {
            connect: {
              id: ctx.currentUserId,
            },
          },
        },
      });
    }),
  deleteUnCheckedFriend: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.currentUserId,
        },
        data: {
          unCheckedFriends: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });
    }),
  addFriend: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          friends: {
            connect: {
              id: ctx.currentUserId,
            },
          },
        },
      });
    }),
  deleteFriend: privatedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          friends: {
            disconnect: {
              id: ctx.currentUserId,
            },
          },
        },
      });
    }),
});
