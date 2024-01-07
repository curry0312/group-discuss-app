import { api } from "~/utils/api";
import Group from "./reuse/Group";
import Group_skeleton from "./reuse/Group_skeleton";

type RenderingGroupsProps = {
  filterSearchGroupText: string;
};

const RenderingGroups = ({ filterSearchGroupText }: RenderingGroupsProps) => {
  const memberGroup = api.group.getAllUserMemberGroups.useQuery();

  const filteredMemberGroup = memberGroup.data?.filter((group) => {
    return group.name
      .toLowerCase()
      .includes(filterSearchGroupText.toLowerCase());
  });

  if (memberGroup.isLoading)
    return (
      <div className="flex flex-col gap-3 px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Group_skeleton key={i} />
        ))}
      </div>
    )
  return (
    <div className="flex flex-col">
      {filteredMemberGroup?.map((group) => {
        return <Group key={group.id} group={group} />;
      })}
    </div>
  );
};

export default RenderingGroups;
