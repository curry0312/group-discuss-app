import { useRouter } from "next/router";
import { api } from "~/utils/api";
import GroupPost from "../../../components/reusable/post/GroupPost";
import GroupPost_skeleton from "../../../components/reusable/post/GroupPost_skeleton";

const RenderingGroupPosts = () => {
  const router = useRouter();
  const { data, isLoading } = api.post.getAllGroupPosts.useQuery({
    groupId: String(router.query.groupId),
  },
  {
    enabled: !!router.query.groupId,
    refetchInterval: 3000
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
    <div>
      {data?.map((post) => (
        <GroupPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderingGroupPosts;