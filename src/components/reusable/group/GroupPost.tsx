import { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";

type GroupPostProps = {
  post: Post;
};
const GroupPost = ({ post }: GroupPostProps) => {
  dayjs.extend(relativeTime);
  const { push } = useRouter();
  return (
    <div className="flex gap-3 p-2 hover:bg-gray-500">
      <div>
        <Link href={"/"}>
          <Image
            src="https://github.com/shadcn.png"
            alt="user-image"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
        </Link>
      </div>

      <div
        className="flex flex-1 flex-col gap-2"
        onClick={() => push(`/post/${post.id}`)}
      >
        <div className="flex items-center gap-2">
          <h1 className="font-bold">Curry0312</h1>
          <span>{dayjs(post.createdAt).toNow()}</span>
        </div>
        <div>
          <p className="text-md">{post.content}</p>
        </div>
        <div>
          <Image
            src={"https://github.com/shadcn.png"}
            alt="post-image"
            width={200}
            height={200}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <CommentIcon />
            <span>4</span>
          </div>
          <div className="flex items-center gap-1">
            <HeartIcon />
            <span>4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPost;
