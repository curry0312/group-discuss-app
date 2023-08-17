import RenderingGroupPosts from "~/components/post/page/RenderingGroupPosts";
import {
  GetServerSidePropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSGHelper";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreateGroupPost from "~/components/post/page/CreateGroupPost";
import GroupHeader from "~/components/group/page/GroupHeader";
import { api } from "~/utils/api";
import LoadingPage from "~/components/loading/LoadingPage";

const GroupPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { data, isLoading, status } = api.post.getAllGroupPosts.useQuery({
    groupId: props.groupId,
  },
  {
    enabled: !!props.groupId,
    refetchInterval: 2000
  }
  );

  if(status !== "success"){
    return <LoadingPage />
  }
  return (
    <>
      <div className={"min-h-screen bg-gray-950 pt-[86px] text-white"}>
        <GroupHeader groupId={props.groupId}/>
        <RenderingGroupPosts posts={data} isLoading={isLoading}/>
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
        groupId={props.groupId}
      />
    </>
  );
};

export default GroupPage;

export async function getStaticProps(
  context: GetServerSidePropsContext<{ groupId: string }>
) {
  const helpers = generateSSGHelper();
  const groupId = context.params?.groupId as string;
  if (typeof groupId !== "string") throw new Error("no groupId");
  // prefetch `post.getAllGroupPosts`
  await helpers.post.getAllGroupPosts.prefetch({ groupId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      groupId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
