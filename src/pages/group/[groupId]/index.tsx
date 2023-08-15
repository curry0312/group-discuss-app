import RenderingGroupPosts from "~/components/reusable/post/RenderingGroupPosts";
import { Input } from "~/components/ui/input";
import AddFriendsToGroupIcon from "~/styles/icons/AddUserIcon";
import {
  GetServerSidePropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSGHelper";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreateGroupPost from "~/components/reusable/post/CreateGroupPost";
import InViteFriendToGroup from "~/components/reusable/group/InviteFriendToGroup";

const GroupPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <>
      <div className={"min-h-screen bg-gray-950 pt-[86px] text-white"}>
        <div className="flex">
          <InViteFriendToGroup groupId={props.groupId} />
          <div className="flex flex-1 items-center justify-center">
            <Input
              type="email"
              placeholder="Search..."
              className="h-[90%] bg-slate-900 text-white"
            />
          </div>
        </div>
        <RenderingGroupPosts groupId={props.groupId} />
      </div>
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 hover:scale-110"
      >
        <PlusIcon className="h-8 w-8 text-white" />
      </button>

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
  if (typeof groupId !== "string") throw new Error("no userId");
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
