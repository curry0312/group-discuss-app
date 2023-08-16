import { Skeleton } from "~/components/ui/skeleton";

const Group_skeleton = () => {
  return (
    <div className="flex gap-1 font-Rubik text-white">
      <div className="basis-1/5">
        <Skeleton className="h-20 w-20 rounded-full bg-slate-800" />
      </div>
      <div className="flex basis-4/5 flex-col gap-3 justify-center">
        <Skeleton className="h-8 w-[250px] bg-slate-800" />
        <Skeleton className="h-4 w-[200px] bg-slate-800" />
      </div>
    </div>
  );
};

export default Group_skeleton;
