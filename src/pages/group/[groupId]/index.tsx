import RenderingGroupPosts from "~/components/post/RenderingGroupPosts";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSGHelper";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreateGroupPost from "~/components/post/CreateGroupPost";
import GroupHeader from "~/components/post/RenderingGroupPostsHeader";
import { api } from "~/utils/api";
import { useScrollPosition } from "~/hooks/useScrollPosition";
import LoadingSpinner from "~/components/loading/LoadingSpinner";

const GroupPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {

  {/*Check whether the CreatePostComponent is currently open or not */}
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  {/*Check whether the user is creating a new post */}
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);

  {/*Store the new post content to show the post which is currently creating */}
  const [newPostData, setNewPostData] = useState("");

  {/*Fetching data from api*/}
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
    if (scrollHeight > 70 && hasNextPage && !isFetching) {
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
        {!!hasNextPage && (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        )}
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
