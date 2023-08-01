import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

const RenderingGroups = () => {
  dayjs.extend(relativeTime);
  const { data, isLoading } = api.group.getAllGroups.useQuery();
  if (isLoading)
    return (
      <div className="flex flex-col gap-3 p-2 md:grid md:grid-cols-4">
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
    <div className="flex flex-col gap-3 px-4 py-2">
      {data.map((group) => {
        return (
          <div
            key={group.id}
            className="flex items-center font-Rubik text-white"
          >
            <div className="basis-1/3">
              <div className="flex items-center justify-center">
                <Image
                  src={group.image}
                  width={80}
                  height={80}
                  alt={`${group.name}-group-image`}
                  className="rounded-full"
                  priority
                />
              </div>
            </div>
            <div className="basis-2/3">
              <div className="flex flex-col gap-1">
                <p>{group.name}</p>
                <p>{group.ownerId}</p>
                <p>{group.public}</p>
                <p>{dayjs(group.createdAt).toNow()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderingGroups;
