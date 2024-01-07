import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Skeleton } from "~/components/ui/skeleton";

import ChevronLeftIcon from "~/styles/icons/ChevronLeftIcon";
import InViteFriendToGroup from "../group/InviteFriendToGroup";
import SettingIcon from "~/styles/icons/SettingIcon";

type GroupHeaderPropsType = {
  groupId: string;
};

const RenderingGroupPostsHeader = ({ groupId }: GroupHeaderPropsType) => {
  const router = useRouter();
  const { data, isLoading } = api.group.getGroup.useQuery({
    id: groupId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[86px] items-center justify-between bg-gray-950 p-4 text-white">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-12 rounded-md bg-gray-900" />
          <Skeleton className="h-6 w-16 rounded-md bg-gray-900" />
        </div>
        <div>
          <Skeleton className="h-10 w-20 rounded-md bg-gray-900" />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex h-[86px] items-center justify-between bg-gray-950 p-4 text-white">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()}>
            <ChevronLeftIcon />
          </button>
          <h1 className="text-xl font-bold">{data?.name}</h1>
          <span className="text-md">({Number(data?.members.length)}) </span>
        </div>
        <div className="flex items-center gap-1">
          <InViteFriendToGroup groupId={groupId} />
          <button className="p-4" onClick={()=>router.push(`/group/setting/${groupId}`)}>
            <SettingIcon />
          </button>
        </div>
      </div>
      <div className="flex items-center px-4 py-2">
        {data?.members.map((member) => (
          <div
            key={member.id}
            className="w-[30px] cursor-pointer"
            onClick={() => router.push(`/profile/${member.id}`)}
          >
            <AspectRatio ratio={1 / 1}>
              <Image
                src={member.image}
                alt="Image"
                className="rounded-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </AspectRatio>
          </div>
        ))}
      </div>
    </>
  );
};

export default RenderingGroupPostsHeader;
