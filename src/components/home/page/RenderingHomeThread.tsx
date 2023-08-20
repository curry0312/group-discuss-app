import { useRouter } from "next/router";
import GroupPost_skeleton from "~/components/post/reuse/GroupPost_skeleton";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import HomeThread from "../reuse/HomeThread";

const RenderingHomeThread = () => {
  const { data, isLoading } = api.post.getAllUserRelativePosts.useQuery(
    undefined,
    {
      refetchInterval: 3000,
    }
  );
  const router = useRouter();
  if (isLoading)
    return (
      <div>
        {Array.from(Array(8))?.map((_, i) => (
          <GroupPost_skeleton key={i} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-3 p-4">
      {data?.length === 0 && (
        <div className="flex h-[500px] items-center justify-center text-center">
          <div className="flex flex-col gap-3">
            <p>No new posts from friends</p>
            <p>You can Create a group and add new friends to chat with</p>
            <div>
              <Button
                variant={"secondary"}
                onClick={() => router.push("/group")}
              >
                Go to manage group
              </Button>
            </div>
          </div>
        </div>
      )}
      {data?.map((post) => (
        <HomeThread key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderingHomeThread;
