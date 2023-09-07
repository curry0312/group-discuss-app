import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";
import ArrowLeftIcon from "~/styles/icons/ArrowLeftIcon";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import generateSSGHelper from "~/utils/generateSSGHelper";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import LoadingPage from "~/components/loading/LoadingPage";
import { Skeleton } from "~/components/ui/skeleton";
import CreateComment from "~/components/post/page/CreateComment";
import { useState } from "react";
import GroupPostComment from "~/components/post/reuse/GroupPostComment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import type { PostWithLikesAndAuthorAndCommentsAndGroupAndCount } from "type";

const PostPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  dayjs.extend(relativeTime);

  const router = useRouter();

  const { user } = useUser();

  const [isCreateCommentOpen, setIsCreateCommentOpen] = useState(false);

  const post = api.post.getPost.useQuery({
    id: props.postId,
  });
  const postLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const postUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();

  const ctx = api.useContext();
  const client = useQueryClient();
  const hasLike = post.data?.likes.find((like) => {
    return like.userId === user?.id;
  });

  function updateCache({
    client,
    variables,
    data,
    action,
  }: {
    client: QueryClient;
    variables: any;
    data: any;
    action: "like" | "unlike";
  }) {
    client.setQueryData(
      [
        ["post", "getPost"],
        {
          input: {
            id: props.postId,
          },
          type: "query",
        },
      ],
      (oldData: any) => {
        console.log(oldData);
        const tempNewData =
          oldData as PostWithLikesAndAuthorAndCommentsAndGroupAndCount;
        const value = action === "like" ? 1 : -1;
        return {
          ...tempNewData,
          likes: action === "like" ? [{ userId: user?.id }] : [],
          _count: {
            likes: tempNewData._count.likes + value,
            comments: tempNewData._count.comments,
          },
        };
      }
    );
  }

  function handleLikeToggle() {
    if (hasLike) {
      postUnLikeGenerator.mutate(
        {
          postId: post?.data?.id!,
          commentId: null,
        },
        {
          onSuccess: (data, variables) => {
            updateCache({ client, data, variables, action: "unlike" });
            // ctx.like.invalidate();
            // ctx.post.invalidate();
          },
        }
      );
    } else {
      postLikeGenerator.mutate(
        {
          postId: post?.data?.id!,
          commentId: null,
        },
        {
          onSuccess: (data, variables) => {
            updateCache({ client, data, variables, action: "like" });
            // ctx.like.invalidate();
            // ctx.post.invalidate();
          },
        }
      );
    }
  }

  if (post.isLoading) return <LoadingPage />;
  return (
    <>
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="flex items-center space-x-5 p-3">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon />
          </button>
        </div>
        <div className="flex gap-3 p-3">
          <div>
            <Link href={`/profile/${post.data?.author.id}`}>
              {!post.data ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <Image
                  src={post.data?.author.image}
                  alt="user-image"
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              )}
            </Link>
          </div>
          <div className="flex items-center justify-center p-3">
            <h1 className="text-xl font-bold">{post.data?.author.name}</h1>
          </div>
        </div>

        <div className="flex flex-col px-2">
          <div className="border-b border-gray-800 p-4">
            <p className="text-xl">{post.data?.content}</p>
            {/* <Image
            src={"https://github.com/shadcn.png"}
            alt="post-image"
            width={200}
            height={200}
            priority
          /> */}
          </div>

          <div className="flex items-center gap-3 border-b border-gray-800 p-4 text-xl">
            <div className="flex items-center gap-2">
              <span>{post.data?._count.comments}</span>
              <p>Comments</p>
            </div>
            <div className="flex items-center gap-2">
              <span>{post.data?._count.likes}</span>
              <p>likes</p>
            </div>
          </div>

          <div className="flex items-center justify-evenly gap-3 p-4">
            <button
              className="flex items-center gap-1"
              onClick={() => setIsCreateCommentOpen(true)}
            >
              <CommentIcon />
            </button>
            <button
              className="flex items-center gap-1"
              onClick={() => handleLikeToggle()}
            >
              <HeartIcon
                className={
                  post.data?.likes.length! > 0
                    ? "text-red-500 transition duration-100"
                    : "transition duration-100"
                }
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          {post.data?.comments.map((comment) => {
            return <GroupPostComment key={comment.id} comment={comment} />;
          })}
        </div>
      </main>

      <CreateComment
        isCreateCommentOpen={isCreateCommentOpen}
        setIsCreateCommentOpen={setIsCreateCommentOpen}
        postId={props.postId}
      />
    </>
  );
};

export default PostPage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ postId: string }>
) {
  const helpers = generateSSGHelper();
  const postId = context.params?.postId as string;
  if (typeof postId !== "string") throw new Error("no post");
  // prefetch `post.getPosts`
  await helpers.post.getPost.prefetch({ id: postId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      postId,
    },
    revalidate: 10,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
