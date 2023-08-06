import { Like, Post } from "@prisma/client";

export type PostWithLikes = Post & {
    likes: Like[];
  }