import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "../ui/skeleton";

const RenderingGroups = () => {
  dayjs.extend(relativeTime);
  const { data, isLoading } = api.group.getAllGroups.useQuery();
  if (isLoading)
    return (
      <div className="flex flex-col gap-3 md:grid md:grid-cols-4 p-2">
        {Array.from(Array(5)).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-800" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-slate-800" />
              <Skeleton className="h-4 w-[200px] bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  if (!data) return <div>404 data not found</div>;
  return (
    <div className="flex flex-col gap-3 md:grid md:grid-cols-4 p-2">
      {data.map((groups) => {
        return (
          <div key={groups.id} className="flex flex-col font-Rubik text-white">
            <p>{groups.name}</p>
            <p>{groups.ownerId}</p>
            <p>{groups.public}</p>
            <p>{dayjs(groups.createdAt).toNow()}</p>
          </div>
        );
      })}
    </div>
  );
};

export default RenderingGroups;


