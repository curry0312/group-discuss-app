import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";

const RenderingGroups = () => {
  dayjs.extend(relativeTime);
  const { data, isLoading } = api.group.getAllUserGroups.useQuery();
  if (isLoading)
    return (
      <div className="flex flex-col gap-3 px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 font-Rubik text-white"
          >
            <div className="basis-1/5">
              <Skeleton className="h-20 w-20 rounded-full bg-slate-800" />
            </div>
            <div className="basis-4/5">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-[250px] bg-slate-800" />
                <Skeleton className="h-4 w-[200px] bg-slate-800" />
              </div>
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
            className="flex items-center gap-3 font-Rubik text-white"
          >
            <div className="basis-1/5">
              <div className="flex items-center justify-center">
                <div className="w-[82px] rounded-full">
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
            <div className="basis-4/5">
              <div className="flex flex-col gap-1">
                <p>{group.name}</p>
                <p>{group.public}</p>
                <p>created {dayjs(group.createdAt).toNow()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderingGroups;
