import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import generateSSRHelper from "~/utils/generateSSRHelper";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import LoadingPage from "~/components/loading/LoadingPage";
import ArrowLeftIcon from "~/styles/icons/ArrowLeftIcon";
import CalenderIcon from "~/styles/icons/CalenderIcon";
import FriendStateButtons from "~/components/profile/PrifileUserAndCurrentUserState";
import PersonalGroupsAndPostsRenderingSection from "~/components/profile/PersonalGroupsAndPostsRenderingSection";
import Navbar from "~/components/global/Navbar";
import { AspectRatio } from "~/components/ui/aspect-ratio";

const ProfilePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  dayjs.extend(relativeTime);

  const { data: userData, isLoading } = api.user.getUser.useQuery({
    id: props.userId,
  });

  if (isLoading) return <LoadingPage />; //Won't be invoked because it's SSR
  if (!userData) return <div>404 data not found</div>;
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 p-3 pt-24 text-white">
        <div className="flex items-center space-x-5 p-2">
          <Link href={"/users"}>
            <ArrowLeftIcon />
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3 py-2">
          <div className="flex w-full items-end justify-between">
            <Link href={`/profile/${userData.id}`}>
              <div className="w-[200px] rounded-full">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={userData.image}
                    alt="user-image"
                    className="rounded-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </AspectRatio>
              </div>
            </Link>
            <FriendStateButtons profileUserInfo={userData} />
          </div>
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="pb-4">
            <p className="text-xl">{userData.bio}</p>
          </div>
          <div className="flex items-center gap-3 pb-4">
            <CalenderIcon />
            <p className="text-xl">Joined</p>
            <p className="text-xl">{dayjs(userData.createdAt).fromNow()}</p>
          </div>
          <div className="flex items-center gap-3  py-4 text-xl">
            <div className="flex items-center gap-2">
              <span>
                {Number(userData.friends.length) +
                  Number(userData.friendsOf.length)}
              </span>
              <p>Friends</p>
            </div>
          </div>

          <PersonalGroupsAndPostsRenderingSection userId={props.userId} />
        </div>
      </main>
    </>
  );
};

export default ProfilePage;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ userId: string }>
) {
  const helpers = generateSSRHelper();
  const userId = context.params?.userId as string;
  if (typeof userId !== "string") throw new Error("no userId");
  // prefetch `user.getUser`
  await helpers.user.getUser.prefetch({ id: userId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      userId,
    },
  };
}
