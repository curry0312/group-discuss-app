import { Comment, Like, Post, User } from "@prisma/client";

export type PostWithLikesAndAuthor = Post & {
    likes: Like[];
    author: User;
}

export type CommentWithLikesAndAuthor = Comment & {
    likes: Like[];
    author: User;
}