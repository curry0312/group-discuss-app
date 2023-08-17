import { api } from "~/utils/api";
import GroupPost from "../reuse/GroupPost";
import GroupPost_skeleton from "../reuse/GroupPost_skeleton";

type RenderingGroupPostsPropsType = {
  groupId: string;
}
const RenderingGroupPosts = ({groupId}:RenderingGroupPostsPropsType) => {
  const { data, isLoading } = api.post.getAllGroupPosts.useQuery({
    groupId: groupId,
  },
  {
    enabled: !!groupId,
    refetchInterval: 5000
  }
  );
  if(isLoading) return (
    <div>
      {Array.from(Array(8))?.map((_,i) => (
        <GroupPost_skeleton key={i} />
      ))}
    </div>       
  )
  return (
    <div className="flex flex-col gap-3 p-4">
      {data?.map((post) => (
        <GroupPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderingGroupPosts;