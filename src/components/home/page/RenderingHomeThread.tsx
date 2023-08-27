import { useRouter } from "next/router";
import { useEffect } from "react";
import GroupPost_skeleton from "~/components/post/reuse/GroupPost_skeleton";
import { Button } from "~/components/ui/button";
import { useScrollPosition } from "~/hooks/useScrollPosition";
import { api } from "~/utils/api";
import HomeThread from "../reuse/HomeThread";

const RenderingHomeThread = () => {
  const router = useRouter();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    api.post.getAllUserRelativePosts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
        refetchInterval: 3000,
      }
    );
    
  const scrollHeight = useScrollPosition();

  useEffect(() => {
    if (scrollHeight > 70 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollHeight, hasNextPage, isFetching]);

  const toShow = data?.pages.flatMap((page) => page.posts);

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
      {toShow?.length === 0 && (
        <div className="flex h-[500px] items-center justify-center text-center">
          <div className="flex flex-col gap-3">
            <p>No new posts from friends</p>
            <p>You can greate a group or add new friends to chat with</p>
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
      {toShow?.map((post) => (
        <HomeThread key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderingHomeThread;
