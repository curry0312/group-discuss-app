import { api } from "~/utils/api";
import LoadingSpinner from "../reusable/loading/LoadingSpinner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "../ui/button";

const RenderingGroups = () => {
  dayjs.extend(relativeTime);
  const { data, isLoading } = api.group.getAllGroups.useQuery();
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <div>404 data not found</div>;
  return (
    <div className="flex flex-col gap-3">
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
