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
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import LoadingPage from "~/components/loading/LoadingPage";

const PostPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  dayjs.extend(relativeTime);
  const { postId } = props;

  const ctx = api.useContext();
  const postLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const postUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();

  const { data, isLoading } = api.post.getPost.useQuery({
    id: postId,
  });
  const isUserLikePost = api.like.isUserLikePost.useQuery({
    postId: postId,
  });

  function handleCommentToggle() {}
  function handleLikeToggle() {
    if (isUserLikePost.data) {
      postUnLikeGenerator.mutate(
        {
          postId: postId,
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
          postId: postId,
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

  if (isLoading) return <LoadingPage />;
  return (
    <main className="min-h-screen bg-gray-950 p-3 pt-24 text-white">
      <div className="flex items-center space-x-5 p-2">
        <Link href={`/group/${data?.groupId}`}>
          <ArrowLeftIcon />
        </Link>
        <span className="text-xl font-bold">Post</span>
      </div>
      <div className="flex gap-3 py-2">
        <div>
          <Link href={"/profile/userId"}>
            <Image
              src="https://github.com/shadcn.png"
              alt="user-image"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold">Curry0312</h1>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="border-b border-gray-800 pb-4">
          <p className="text-xl">{data?.content}</p>
          <Image
            src={"https://github.com/shadcn.png"}
            alt="post-image"
            width={200}
            height={200}
            priority
          />
        </div>

        <div className="flex items-center gap-3 border-b border-gray-800 py-4 text-xl">
          <div className="flex items-center gap-2">
            <span>0</span>
            <p>Comments</p>
          </div>
          <div className="flex items-center gap-2">
            <span>{data?.likes.length}</span>
            <p>likes</p>
          </div>
        </div>

        <div className="flex items-center justify-evenly gap-3 py-4">
          <button
            className="flex items-center gap-1"
            onClick={() => handleCommentToggle()}
          >
            <CommentIcon className="" />
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
    </main>
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
