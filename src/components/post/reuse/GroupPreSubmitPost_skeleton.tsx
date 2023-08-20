import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import LoadingSpinner from "~/components/loading/LoadingSpinner";

import MoreIcon from "~/styles/icons/MoreIcon";

type GroupPreSubmitPostSkeletonProps = {
  data: string;
};

dayjs.extend(relativeTime);

const GroupPreSubmitPost_skeleton = ({
  data,
}: GroupPreSubmitPostSkeletonProps) => {
  const { user } = useUser();

  return (
    <div className="relative flex cursor-pointer gap-3 border-b border-gray-800 p-2">
      <div>
        <Link href={"/"}>
          <Image
            src={user?.imageUrl || ""}
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
          {/*post user's info*/}
          <h1 className="font-bold">
            {user?.lastName}
            {user?.firstName}
          </h1>
        </div>
        {/*post content*/}
        <div className="flex flex-col">
          <div className="w-full">
            <p className="text-md">{data}</p>
          </div>
        </div>
        {/*post likes and comments*/}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>0</span>
            <span>comments</span>
          </div>
          <div className={"flex items-center gap-2"}>
            <span>0</span>
            <span>likes</span>
          </div>
        </div>
      </div>
      {/*post option*/}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto mr-2">
            <MoreIcon />
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>

      <div className="absolute z-[999] inset-0 bg-gray-950 bg-opacity-90 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default GroupPreSubmitPost_skeleton;
