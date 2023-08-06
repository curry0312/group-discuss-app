import { Like, Post, User } from "@prisma/client";

export type PostWithLikesAndAuthor = Post & {
    likes: Like[];
    author: User;
  }