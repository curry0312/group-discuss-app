import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

const GroupPost_skeleton = () => {
  return (
    <div className="flex gap-3 p-2">
      <div>
        <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-[100px] bg-slate-800" />
          <Skeleton className="h-5 w-[100px] bg-slate-800" />
        </div>
        <div>
          <Skeleton className="h-16 w-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default GroupPost_skeleton;
