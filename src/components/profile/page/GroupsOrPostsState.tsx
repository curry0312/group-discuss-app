import React, { useState } from "react";
import Group from "~/components/group/reuse/Group";
import LoadingSpinner from "~/components/loading/LoadingSpinner";
import GroupPost from "~/components/post/reuse/GroupPost";
import { api } from "~/utils/api";

type GroupsOrPostsStateProps = {
  userId: string;
};
const GroupsOrPostsState = ({ userId }: GroupsOrPostsStateProps) => {
  const [GroupsOrPosts, setGroupsOrPosts] = useState<"groups" | "posts">(
    "groups"
  );
  const allProfileUserPublicMemberGroups = api.group.getAllProfileUserPublicMemberGroups.useQuery({ userId: userId });

  const allUserInPublicGroupsPosts = api.post.getAllUserInPublicGroupsPosts.useQuery({ authorId: userId });

  return (
    <>
      <div className="flex items-center justify-evenly">
        <button
          className={
            GroupsOrPosts === "groups"
              ? "flex-1 bg-white py-2 text-gray-950 transition duration-200 ease-in-out hover:bg-white hover:text-gray-950"
              : "flex-1 py-2 transition duration-200 ease-in-out hover:bg-white hover:text-gray-950"
          }
          onClick={() => setGroupsOrPosts("groups")}
        >
          Public groups
        </button>
        <button
          className={
            GroupsOrPosts === "posts"
              ? "flex-1 bg-white py-2 text-gray-950 transition duration-200 ease-in-out hover:bg-white hover:text-gray-950"
              : "flex-1 py-2 transition duration-200 ease-in-out hover:bg-white hover:text-gray-950"
          }
          onClick={() => setGroupsOrPosts("posts")}
        >
          Public posts
        </button>
      </div>

      {GroupsOrPosts === "groups" ? (
        <div>
          {allProfileUserPublicMemberGroups.isLoading ? (
            <div className="flex h-36 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-2">
              {allProfileUserPublicMemberGroups.data?.map((group) => (
                <Group key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {allUserInPublicGroupsPosts.isLoading ? (
            <div className="flex h-36 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-2">
              {allUserInPublicGroupsPosts.data?.map((post) => (
                <GroupPost key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GroupsOrPostsState;
