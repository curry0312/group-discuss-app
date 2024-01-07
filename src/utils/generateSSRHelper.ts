import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { prisma } from "~/server/db";


export default function generateSSRHelper() {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      currentUserId: "test",
    },
    transformer: superjson, // optional - adds superjson serialization
  });
  return helpers;
}
