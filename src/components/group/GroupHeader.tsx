import Link from "next/link";
import React from "react";
import { Skeleton } from "~/components/ui/skeleton";
import ChevronLeftIcon from "~/styles/icons/ChevronLeftIcon";
import { api } from "~/utils/api";
import InViteFriendToGroup from "./InviteFriendToGroup";

type GroupHeaderProps = {
  groupId: string;
};

const GroupHeader = ({ groupId }: GroupHeaderProps) => {
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
      </div>
    );
  }
  return (
    <div className="flex h-[86px] items-center justify-between bg-gray-950 p-4 text-white">
      <div className="flex items-center">
        <Link href={"/group"}>
          <ChevronLeftIcon />
        </Link>
        <h1 className="ml-4 text-lg">{data?.name}</h1>
        <span className="text-md">({Number(data?.members.length)})</span>
      </div>
      <div>
        <InViteFriendToGroup groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupHeader;
