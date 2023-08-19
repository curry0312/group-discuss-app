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

import type { PostWithLikesAndAuthorAndCommentsAndGroup } from "type";

import MoreIcon from "~/styles/icons/MoreIcon";
import { api } from "~/utils/api";

type GroupPostProps = {
  post: PostWithLikesAndAuthorAndCommentsAndGroup;
};

dayjs.extend(relativeTime);
const GroupPost = ({ post }: GroupPostProps) => {
  const { push } = useRouter();
  const { user } = useUser();
  const ctx = api.useContext();
  const deletePostGenerator = api.post.deletePost.useMutation();

  const isUserLikePost = post.likes.find((like) => like.userId === user?.id);

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
    <div className="flex cursor-pointer gap-3 border-b border-gray-800 p-2">
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

      <div
        className="flex flex-1 flex-col gap-2"
        onClick={() => push(`/post/${post.id}`)}
      >
        <div className="flex items-center gap-2">
          {/*post user's info*/}
          <h1 className="font-bold">{post.author.name}</h1>
          <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
          {/*post option*/}
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
        {/*post content*/}
        <div className="flex flex-col">
          <div>
            <p className="text-md">{post.content}</p>
          </div>
        </div>
        {/*post likes and comments*/}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>{post.comments.length}</span>
            <span>comments</span>
          </div>
          <div
            className={
              !!isUserLikePost === true
                ? "flex items-center gap-2 text-red-400"
                : "flex items-center gap-2"
            }
          >
            <span>{post.likes.length}</span>
            <span>likes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPost;
