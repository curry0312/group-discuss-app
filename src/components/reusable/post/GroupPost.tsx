import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

import type { PostWithLikesAndAuthor } from "type";

import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";
import MoreIcon from "~/styles/icons/MoreIcon";
import { api } from "~/utils/api";

type GroupPostProps = {
  post: PostWithLikesAndAuthor;
};

const GroupPost = ({ post }: GroupPostProps) => {
  dayjs.extend(relativeTime);
  const { push } = useRouter();
  const ctx = api.useContext();
  const postLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const postUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();
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
    <div className="flex cursor-pointer gap-3 p-2">
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
          <h1 className="font-bold">Curry0312</h1>
          <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto mr-2">
              <MoreIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Delete post</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  ? "text-red-500 transition duration-200"
                  : "transition duration-200"
              }
            />
            <span>{post.likes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPost;
