import { PostWithLikesAndAuthorAndCommentsAndGroup } from "type";
import GroupPost from "../reuse/GroupPost";
import GroupPost_skeleton from "../reuse/GroupPost_skeleton";

type RenderingGroupPostsPropsType = {
  posts: PostWithLikesAndAuthorAndCommentsAndGroup[] | undefined;
  isLoading: boolean;
};
const RenderingGroupPosts = ({
  posts,
  isLoading,
}: RenderingGroupPostsPropsType) => {
  if (isLoading)
    return (
      <div>
        {Array.from(Array(8))?.map((_, i) => (
          <GroupPost_skeleton key={i} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col">
      {posts?.map((post) => (
        <GroupPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderingGroupPosts;
