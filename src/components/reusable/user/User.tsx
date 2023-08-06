import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import ArrowRightUpIcon from "~/styles/icons/ArrowRightUpIcon";

type UserProps = {
  user: User
};

const User = ({ user }: UserProps) => {
  return (
    <div
      key={user.id}
      className="flex items-center gap-3 font-Rubik text-white px-5 py-3 hover:bg-slate-900"
    >
      <div className="basis-1/5">
        <div className="w-[50px] rounded-full">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={user.image}
              alt="group-image"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-full object-cover"
            />
          </AspectRatio>
        </div>
      </div>
      <div className="basis-4/5">
        <div className="flex flex-col gap-1">
          <p>{user.name}</p>
        </div>
      </div>
      <div>
        <ArrowRightUpIcon />
      </div>
    </div>
  );
};

export default User;
