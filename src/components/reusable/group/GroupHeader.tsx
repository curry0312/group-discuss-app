import Link from "next/link";
import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import ChevronLeftIcon from "~/styles/icons/ChevronLeftIcon";
import { api } from "~/utils/api";
import InViteFriendToGroup from "./InviteFriendToGroup";

type GroupHeaderPropsType = {
  groupId: string;
};

const GroupHeader = ({ groupId }: GroupHeaderPropsType) => {
  const { data, isLoading } = api.group.getGroup.useQuery({
    groupId: groupId,
  });
  if(isLoading){
    return (
        <div className="flex items-center justify-between bg-gray-950 h-[86px] p-4 text-white">
      <div className="flex gap-2 items-center">
        <Skeleton className="w-6 h-6 rounded-md"/>
        <Skeleton className="w-16 h-6 rounded-md"/>
      </div>
      <div>
        <Skeleton className="w-16 h-8 rounded-md"/>
      </div>
    </div>
    )
  }
  return (
    <div className="flex items-center justify-between bg-gray-950 h-[86px] p-4 text-white">
      <div className="flex items-center">
        <Link href={"/group"}>
          <ChevronLeftIcon />
        </Link>
        <h1 className="ml-4 text-lg">{data?.name}</h1>
        <span className="text-md">({Number(data?.members.length)})</span>
      </div>
      <div>
        <InViteFriendToGroup groupId={groupId} />
        {/* <BarsIcon /> */}
      </div>
    </div>
  );
};

export default GroupHeader;
