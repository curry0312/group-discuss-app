import RenderingGroupPosts from "~/components/post/page/RenderingGroupPosts";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSGHelper";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreateGroupPost from "~/components/post/page/CreateGroupPost";
import GroupHeader from "~/components/post/page/RenderingGroupPostsHeader";
import { api } from "~/utils/api";
import { useScrollPosition } from "~/hooks/useScrollPosition";

const GroupPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);

  const [newPostData, setNewPostData] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    api.post.getAllGroupPosts.useInfiniteQuery(
      {
        limit: 10,
        groupId: props.groupId,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
        refetchInterval: 2000,
      }
    );

  const toShow = data?.pages.flatMap((page) => page.posts);

  const scrollHeight = useScrollPosition();

  useEffect(() => {
    if (scrollHeight > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollHeight, hasNextPage, isFetching]);

  return (
    <>
      <div className={"min-h-screen bg-gray-950 text-white"}>
        <GroupHeader groupId={props.groupId} />
        <RenderingGroupPosts
          posts={toShow}
          isLoading={isLoading}
          isCreatingNewPost={isCreatingNewPost}
          newPostData={newPostData}
        />
      </div>

      {/*create post button*/}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 hover:scale-110"
      >
        <PlusIcon className="h-8 w-8 text-white" />
      </button>

      {/*Toggle component*/}
      <CreateGroupPost
        isCreatePostOpen={isCreatePostOpen}
        setIsCreatePostOpen={setIsCreatePostOpen}
        setIsCreatingNewPost={setIsCreatingNewPost}
        setNewPostData={setNewPostData}
        groupId={props.groupId}
      />
    </>
  );
};

export default GroupPage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ groupId: string }>
) {
  const helpers = generateSSGHelper();
  const groupId = context.params?.groupId as string;
  // prefetch `post.getAllGroupPosts`
  await helpers.post.getAllGroupPosts.prefetch({ limit: 5, groupId: groupId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      groupId,
    },
    revalidate: 10,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
