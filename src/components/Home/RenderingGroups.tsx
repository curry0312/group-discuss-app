import { api } from "~/utils/api";
import Group from "../reusable/group/Group";
import Group_skeleton from "../reusable/group/Group_skeleton";

const RenderingGroups = () => {
  const { data, isLoading } = api.group.getAllUserGroups.useQuery();
  if (isLoading)
    return (
      <div className="flex flex-col gap-3 px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Group_skeleton key={i} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col">
      {data?.map((group) => {
        return <Group key={group.id} group={group} />;
      })}
    </div>
  );
};

export default RenderingGroups;
