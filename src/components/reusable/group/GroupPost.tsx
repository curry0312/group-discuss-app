import { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";
import { api } from "~/utils/api";

type GroupPostProps = {
  post: Post;
};
const GroupPost = ({ post }: GroupPostProps) => {
  dayjs.extend(relativeTime);
  const { push } = useRouter();
  const ctx = api.useContext();
  const postLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const postUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();
  const postLikes = api.post.getPostLikes.useQuery({
    postId: post.id,
  });
  const isUserLikePost = api.like.isUserLikePost.useQuery({
    postId: post.id,
  });
  function handleCommentToggle() {}
  function handleLikeToggle() {
    if (isUserLikePost.data) {
      postUnLikeGenerator.mutate(
        {
          postId: post.id,
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
          postId: post.id,
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
  return (
    <div className="flex gap-3 p-2 hover:bg-gray-500 cursor-pointer">
      <div>
        <Link href={"/"}>
          <Image
            src="https://github.com/shadcn.png"
            alt="user-image"
            width={50}
            height={50}
            className="rounded-full object-cover"
            priority
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="font-bold">Curry0312</h1>
          <span>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <div className="flex flex-col" onClick={() => push(`/post/${post.id}`)}>
          <div>
            <p className="text-md">{post.content}</p>
          </div>
          <div>
            <Image
              src={"https://github.com/shadcn.png"}
              alt="post-image"
              width={200}
              height={200}
              priority
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <button
              className="flex items-center gap-1"
              onClick={() => handleCommentToggle()}
            >
              <CommentIcon className="" />
              <span>0</span>
            </button>
          </div>
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
            <span>{postLikes.data?.likes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPost;
