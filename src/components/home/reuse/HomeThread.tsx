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
import { AspectRatio } from "~/components/ui/aspect-ratio";

import MoreIcon from "~/styles/icons/MoreIcon";
import { api } from "~/utils/api";

type HomeThreadProps = {
  post: PostWithLikesAndAuthorAndCommentsAndGroup;
};

dayjs.extend(relativeTime);
const HomeThread = ({ post }: HomeThreadProps) => {
  const { push } = useRouter();
  const { user } = useUser();
  const ctx = api.useContext();

  const isUserLikePost = post.likes.find((like) => like.userId === user?.id);

  const deletePostGenerator = api.post.deletePost.useMutation();

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
    <div>
      {/*Group Info*/}
      <div
        className="ml-auto flex items-center gap-2 p-2 cursor-pointer"
        onClick={() => push(`/group/${post.groupId}`)}
      >
        <div className="h-[50px] w-[50px]">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={post.group.image}
              alt="group-image"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-full object-cover"
            />
          </AspectRatio>
        </div>
        <span className="text-xl font-Rubik">{post.group.name}</span>
      </div>
      {/*Post Info*/}
      <div className="pl-10">
        <div className="flex cursor-pointer gap-3 rounded-md bg-gray-800 hover:bg-gray-700 p-2">
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
              <h1 className="font-bold">{post.author.name}</h1>
              <span className="ml-auto text-xs">
                {dayjs(post.createdAt).fromNow()}
              </span>
            </div>
            <div className="flex flex-col">
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
              <div className="flex items-center gap-2">
                <span>{post.comments.length}</span>
                <span>comments</span>
              </div>
              <div
                className={
                  !!isUserLikePost
                    ? "flex items-center gap-2 text-red-400"
                    : "flex items-center gap-2"
                }
              >
                <span>{post.likes.length}</span>
                <span>likes</span>
              </div>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="mr-2">
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
        </div>
      </div>
    </div>
  );
};

export default HomeThread;
