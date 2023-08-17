import { GetStaticPaths } from "next";
import { api } from "~/utils/api";
import generateSSGHelper from "~/utils/generateSSGHelper";
import Group from "../reuse/Group";
import Group_skeleton from "../reuse/Group_skeleton";

const RenderingGroups = () => {
  const ownerGroup = api.group.getAllUserOwnerGroups.useQuery();
  const memberGroup = api.group.getAllUserMemberGroups.useQuery();

  if (ownerGroup.isLoading || memberGroup.isLoading)
    return (
      <div className="flex flex-col gap-3 px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Group_skeleton key={i} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col">
      {memberGroup.data?.map((group) => {
        return <Group key={group.id} group={group} />;
      })}
    </div>
  );
};

export default RenderingGroups;

// export async function getStaticProps() {
//   const helpers = generateSSGHelper();

//   // prefetch `groups`
//   await helpers.group.getAllUserMemberGroups.prefetch();
//   await helpers.group.getAllUserOwnerGroups.prefetch();
//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//     },
//     revalidate: 1,
//   };
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
//     fallback: "blocking",
//   };
// };
