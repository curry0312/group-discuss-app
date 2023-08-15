import { api } from "~/utils/api";
import Group from "./Group";
import Group_skeleton from "./Group_skeleton";

const RenderingGroups = () => {
  const ownerGroup = api.group.getAllUserOwnerGroups.useQuery();
  const memberGroup = api.group.getAllUserMemberGroups.useQuery();
  
  if (ownerGroup.isLoading || memberGroup.isLoading)
    return (
      <div className="flex flex-col gap-3 px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Group_skeleton key={i} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col">
      {memberGroup.data?.map((group) => {
        return <Group key={group.id} group={group} />;
      })}
    </div>
  );
};

export default RenderingGroups;
