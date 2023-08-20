import { PostWithLikesAndAuthorAndCommentsAndGroup } from "type";
import GroupPost from "../reuse/GroupPost";
import GroupPost_skeleton from "../reuse/GroupPost_skeleton";
import GroupPreSubmitPost_skeleton from "../reuse/GroupPreSubmitPost_skeleton";

type RenderingGroupPostsPropsType = {
  posts: PostWithLikesAndAuthorAndCommentsAndGroup[] | undefined;
  isLoading: boolean;
  isCreatingNewPost: boolean;
  newPostData: string;
};
const RenderingGroupPosts = ({
  posts,
  isLoading,
  isCreatingNewPost,
  newPostData,
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
      {isCreatingNewPost === true && (
        <GroupPreSubmitPost_skeleton data={newPostData} />
      )}
      {posts?.map((post) => (
        <GroupPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default RenderingGroupPosts;
