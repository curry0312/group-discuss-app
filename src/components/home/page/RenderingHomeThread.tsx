import GroupPost_skeleton from "~/components/post/reuse/GroupPost_skeleton";
import { api } from "~/utils/api";
import HomeThread from "../reuse/HomeThread";

const RenderingHomeThread = () => {
  const { data, isLoading } = api.post.getAllUserRelativePosts.useQuery();
  if (isLoading)
    return (
      <div>
        {Array.from(Array(8))?.map((_, i) => (
          <GroupPost_skeleton key={i} />
        ))}
      </div>
    );
  return (
    <>
      {data?.map((post) => (
        <HomeThread key={post.id} post={post} />
      ))}
    </>
  );
};

export default RenderingHomeThread;
