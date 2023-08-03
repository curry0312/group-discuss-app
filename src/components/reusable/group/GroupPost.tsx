import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import CommentIcon from "~/styles/icons/CommentIcon";
import HeartIcon from "~/styles/icons/HeartIcon";

const GroupPost = () => {
  return (
    <div className="flex gap-3 p-2">
      <div>
        <Link href={"/"}>
          <Image src="https://github.com/shadcn.png" alt="user-image" width={50} height={50} className="object-cover rounded-full"/>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="font-bold">Curry0312</h1>
          <span>15m</span>
        </div>
        <div>
          <p className="text-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
            necessitatibus eligendi aspernatur. Veritatis, nulla culpa! Officiis
            at illum ea nostrum deleniti illo dolorum hic id, laudantium
            dignissimos aut, dicta laboriosam!
          </p>
        </div>
        <div className="">
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
