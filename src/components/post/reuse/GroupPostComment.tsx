import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

import type { CommentWithLikesAndAuthor } from "type";

import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";
import MoreIcon from "~/styles/icons/MoreIcon";
import { api } from "~/utils/api";

type GroupPostCommentProps = {
  comment: CommentWithLikesAndAuthor;
};

dayjs.extend(relativeTime);

const GroupPostComment = ({ comment }: GroupPostCommentProps) => {
  const { user } = useUser();

  const ctx = api.useContext();

  const isUserLikeComment = comment.likes.find(
    (like) => like.userId === user?.id
  );

  const commentLikeGenerator = api.like.handleLikeAddToggle.useMutation();
  const commentUnLikeGenerator = api.like.handleLikeDeleteToggle.useMutation();
  const deleteCommentGenerator = api.comment.deleteComment.useMutation();

  function handleLikeToggle() {
    if (!!isUserLikeComment) {
      commentUnLikeGenerator.mutate(
        {
          id: comment.likes.find((like) => like.userId === user?.id)!.id,
          postId: null,
          commentId: comment.id,
        },
        {
          onSuccess: () => {
            ctx.like.invalidate();
            ctx.comment.invalidate();
          },
        }
      );
    } else {
      commentLikeGenerator.mutate(
        {
          postId: null,
          commentId: comment.id,
        },
        {
          onSuccess: () => {
            ctx.like.invalidate();
            ctx.comment.invalidate();
          },
        }
      );
    }
  }
  function handleDeleteComment() {
    deleteCommentGenerator.mutate(
      { id: comment.id },
      {
        onSuccess: () => {
          ctx.comment.invalidate();
        },
      }
    );
  }

  return (
    <div className="flex cursor-pointer gap-3 border-y border-gray-700 p-2">
      <div>
        <Link href={"/"}>
          <Image
            src={comment.author.image}
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
          <h1 className="font-bold">{comment.author.name}</h1>
          <span className="text-xs">{dayjs(comment.createdAt).fromNow()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto mr-2">
              <MoreIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user?.id === comment.author.id ? (
                <>
                  <DropdownMenuItem onClick={() => handleDeleteComment()}>
                    Delete comment
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit comment</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>Report</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col">
          <div>
            <p className="text-md">{comment.content}</p>
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
          {/* <div>
            <button className="flex items-center gap-1" onClick={() => {}}>
              <CommentIcon className="" />
              <span>0</span>
            </button>
          </div> */}
          <button
            className="flex items-center gap-1"
            onClick={() => handleLikeToggle()}
          >
            <HeartIcon
              className={
                !!isUserLikeComment
                  ? "text-red-500 transition duration-200"
                  : "transition duration-200"
              }
            />
            <span>{comment.likes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPostComment;
