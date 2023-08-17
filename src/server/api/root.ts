import { postRouter } from './routers/post';
import { userRouter } from './routers/user';

import { createTRPCRouter } from "~/server/api/trpc";
import { groupRouter } from "./routers/group";
import { likeRouter } from './routers/like';
import { commentRouter } from './routers/comment';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  group: groupRouter,
  user: userRouter,
  post: postRouter,
  like: likeRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
