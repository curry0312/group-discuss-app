import { Comment, Group, Like, Post, User } from "@prisma/client";

export type PostWithLikesAndAuthorAndCommentsAndGroupAndCount = Post & {
    likes: Like[];
    author: User;
    comments: Comment[];
    group: Group;
    _count: {
        likes: number;
        comments: number;
    };
}

export type GroupWithMembers = Group & {
    members: User[]
}

export type CommentWithLikesAndAuthor = Comment & {
    likes: Like[];
    author: User;
}