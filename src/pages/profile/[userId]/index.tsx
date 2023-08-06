import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import generateSSGHelper from "~/utils/generateSSGHelper";
import type {
  GetServerSidePropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";

import LoadingPage from "~/components/reusable/loading/LoadingPage";
import ArrowLeftIcon from "~/styles/icons/ArrowLeftIcon";
import CalenderIcon from "~/styles/icons/CalenderIcon";
import { Button } from "~/components/ui/button";
import { useUser } from "@clerk/nextjs";

const ProfilePage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  dayjs.extend(relativeTime);
  const { userId } = props;
  const userInfo = useUser();

  const { data, isLoading } = api.user.getUser.useQuery({
    id: userId,
  });

  const addUnCheckedFriend = api.user.addUnCheckedFriend.useMutation();

  function handleAddUnCheckedFriend() {
    addUnCheckedFriend.mutate(
      {
        id: userId,
      },
      {
        onSuccess: (e) => {
          console.log(`sent friend invitation to ${data?.name}`);
          console.log(
            `${data?.name} have an unChecked friend name's ${userInfo.user?.lastName}`
          );
        },
      }
    );
  }

  if (isLoading && !userInfo.isLoaded) return <LoadingPage />;
  if (!data) return <div>404 data not found</div>;
  return (
    <main className="min-h-screen bg-gray-950 p-3 pt-24 text-white">
      <div className="flex items-center space-x-5 p-2">
        <Link href={"/users"}>
          <ArrowLeftIcon />
        </Link>
      </div>
      <div className="flex flex-col items-start gap-3 py-2">
        <div className="flex w-full items-end justify-between">
          <Link href={"/profile/userId"}>
            <Image
              src={data.image}
              alt="user-image"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          </Link>
          {userId === userInfo.user?.id ? (
            <>
              <Button variant={"outline"} className="bg-gray-800">Edit profile</Button>
            </>
          ) : (
            <>
              <Button
                variant={"secondary"}
                onClick={() => handleAddUnCheckedFriend()}
              >
                Add friend
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold">{data.name}</h1>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="pb-4">
          <p className="text-xl">description here</p>
        </div>
        <div className="flex items-center gap-3 pb-4">
          <CalenderIcon />
          <p className="text-xl">Joined</p>
          <p className="text-xl">{dayjs(data.createdAt).fromNow()}</p>
        </div>
        <div className="flex items-center gap-3  py-4 text-xl">
          <div className="flex items-center gap-2">
            <span>0</span>
            <p>Friends</p>
          </div>
        </div>

        <div className="flex items-center justify-evenly">
          <button className="flex-1 py-2 hover:bg-gray-400" onClick={() => {}}>
            Groups
          </button>
          <button className="flex-1 py-2 hover:bg-gray-400" onClick={() => {}}>
            Posts
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

export async function getStaticProps(
  context: GetServerSidePropsContext<{ userId: string }>
) {
  const helpers = generateSSGHelper();
  const userId = context.params?.userId as string;
  if (typeof userId !== "string") throw new Error("no userId");
  // prefetch `user.getUser`
  await helpers.user.getUser.prefetch({ id: userId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      userId,
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
