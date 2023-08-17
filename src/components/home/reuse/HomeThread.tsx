import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

import type { PostWithLikesAndAuthor } from "type";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Skeleton } from "~/components/ui/skeleton";

import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";
import MoreIcon from "~/styles/icons/MoreIcon";
import { api } from "~/utils/api";

type HomeThreadProps = {
  post: PostWithLikesAndAuthor;
};

const HomeThread = ({ post }: HomeThreadProps) => {
  dayjs.extend(relativeTime);
  const { push } = useRouter();
  const { user } = useUser();
  const ctx = api.useContext();
  const isUserLikePost = api.like.isUserLikePost.useQuery({
    postId: post.id,
  });
  const group = api.group.getGroup.useQuery({
    groupId: post.groupId,
  });
  const postLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const postUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();

  const deletePostGenerator = api.post.deletePost.useMutation();
  function handleCommentToggle() {}
  function handleLikeToggle() {
    if (isUserLikePost.data) {
      postUnLikeGenerator.mutate(
        {
          id: post.likes.find((like) => like.userId === user?.id)!.id,
          postId: post.id,
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
          postId: post.id,
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

  function handleDeletePost() {
    deletePostGenerator.mutate(
      { id: post.id },
      {
        onSuccess: () => {
          ctx.post.invalidate();
        },
      }
    );
  }

  return (
    <div className="flex cursor-pointer gap-3 rounded-md bg-gray-800 p-2">
      <div>
        <Link href={"/"}>
          <Image
            src={post.author.image}
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
          <h1 className="font-bold">{post.author.name}</h1>
          <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto mr-2">
              <MoreIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user?.id === post.author.id ? (
                <>
                  <DropdownMenuItem onClick={() => handleDeletePost()}>
                    Delete post
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>Report</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col" onClick={() => push(`/post/${post.id}`)}>
          <div>
            <p className="text-md">{post.content}</p>
          </div>
          {/* <div>
            <Image
              src={"https://github.com/shadcn.png"}
              alt="post-image"
              width={200}
              height={200}
              priority
            />
          </div> */}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1"
            onClick={() => handleCommentToggle()}
          >
            <CommentIcon className="" />
            <span>0</span>
          </button>

          <button
            className="flex items-center gap-1"
            onClick={() => handleLikeToggle()}
          >
            <HeartIcon
              className={
                isUserLikePost.data
                  ? "text-red-500 transition duration-200"
                  : "transition duration-200"
              }
            />
            <span>{post.likes.length}</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {group.isLoading ? (
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-500" />
                <Skeleton className="h-8 w-16 rounded-md bg-slate-500" />
              </div>
            ) : (
              <div className="w-[30px] rounded-full">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={group.data?.image || "https://github.com/shadcn.png"}
                    alt="group-image"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-full object-cover"
                  />
                </AspectRatio>
              </div>
            )}
            <span>{group.data?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeThread;
