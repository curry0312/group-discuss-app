import { Comment, Like, Post, User } from "@prisma/client";

export type PostWithLikesAndAuthorAndComments = Post & {
    likes: Like[];
    author: User;
    comments: Comment[];
}

export type CommentWithLikesAndAuthor = Comment & {
    likes: Like[];
    author: User;
}