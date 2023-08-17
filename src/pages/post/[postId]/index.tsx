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
  GetServerSidePropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";

import LoadingPage from "~/components/loading/LoadingPage";
import { Skeleton } from "~/components/ui/skeleton";
import CreateComment from "~/components/post/page/CreateComment";
import { useState } from "react";
import GroupPost from "~/components/post/reuse/GroupPost";
import GroupPostComment from "~/components/post/reuse/GroupPostComment";
import { useUser } from "@clerk/nextjs";

const PostPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  dayjs.extend(relativeTime);

  const {user} = useUser()

  const [isCreateCommentOpen, setIsCreateCommentOpen] = useState(false);

  const ctx = api.useContext();
  const postLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const postUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();

  const post = api.post.getPost.useQuery({
    id: props.postId,
  });
  const allPostComments = api.comment.getAllPostComments.useQuery({
    postId: props.postId,
  });
  const isUserLikePost = api.like.isUserLikePost.useQuery({
    postId: props.postId,
  });

  function handleLikeToggle() {
    if (isUserLikePost.data) {
      postUnLikeGenerator.mutate(
        {
          id: post?.data?.likes.find((like) => like.userId === user?.id)!.id!,
          postId: post?.data?.id!,
          commentId: null,
        },
        {
          onSuccess: () => {
            ctx.like.invalidate();
            ctx.post.invalidate();
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
          onSuccess: () => {
            ctx.like.invalidate();
            ctx.post.invalidate();
          },
        }
      );
    }
  }

  if (post.isLoading) return <LoadingPage />;
  return (
    <>
      <main className="min-h-screen bg-gray-950 pt-24 text-white">
        <div className="flex items-center space-x-5 p-3">
          <Link href={`/group/${post.data?.groupId}`}>
            <ArrowLeftIcon />
          </Link>
          <span className="text-xl font-bold">Post</span>
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
              <span>{post.data?.comments.length}</span>
              <p>Comments</p>
            </div>
            <div className="flex items-center gap-2">
              <span>{post.data?.likes.length}</span>
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
                  isUserLikePost.data
                    ? "text-red-500 transition duration-100"
                    : "transition duration-100"
                }
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          {allPostComments.data?.map((post) => {
            return post.comments.map((comment) => {
              return <GroupPostComment key={comment.id} comment={comment} />;
            });
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
  context: GetServerSidePropsContext<{ postId: string }>
) {
  const helpers = generateSSGHelper();
  const postId = context.params?.postId as string;
  if (typeof postId !== "string") throw new Error("no post");
  // prefetch `post.getPosts`
  await helpers.post.getPost.prefetch({ id: postId });
  // prefetch `like.isUserLikePost`
  await helpers.like.isUserLikePost.prefetch({ postId: postId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      postId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
