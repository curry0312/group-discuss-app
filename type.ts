import { Comment, Group, Like, Post, User } from "@prisma/client";

export type PostWithLikesAndAuthorAndCommentsAndGroup = Post & {
    likes: Like[];
    author: User;
    comments: Comment[];
    group: Group
}

export type CommentWithLikesAndAuthor = Comment & {
    likes: Like[];
    author: User;
}