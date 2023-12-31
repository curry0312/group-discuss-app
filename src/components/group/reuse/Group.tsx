import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import GlobalIcon from "~/styles/icons/GlobalIcon";
import type { GroupWithMembers } from "type";

type GroupTypesProps = {
  group: GroupWithMembers
};

const Group = ({ group }: GroupTypesProps) => {
  dayjs.extend(relativeTime);
  const { user } = useUser();
  return (
    <Link
      href={`/group/${group.id}`}
      key={group.id}
      className="flex gap-1 font-Rubik text-white hover:bg-gray-800"
    >
      <div className="basis-1/4">
        <div className="flex items-center justify-center p-2">
          <div className="w-[64px] rounded-full">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={group.image}
                alt="group-image"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
      <div className="flex basis-3/4 flex-col justify-center">
        <div className="flex items-center gap-1">
          <p className="text-xl">{group.name}</p>
          <p className="text-xl">({group.members.length})</p>
          {group.public === true && <GlobalIcon />}
        </div>
        <p className="text-xs">created {dayjs(group.createdAt).fromNow()}</p>
        <p className="text-xs text-amber-400">
          {group.ownerId == user?.id && "Owner"}
        </p>
      </div>
    </Link>
  );
};

export default Group;
