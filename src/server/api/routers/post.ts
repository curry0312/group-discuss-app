import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx,input }) => {
      
    }),
});
