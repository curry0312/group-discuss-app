import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import GroupUserIcon from "~/styles/icons/GroupUser";

import Head from "next/head";

import LoadingPage from "~/components/reusable/loading/LoadingPage";
import Navbar from "~/components/global/Navbar";
import RenderingGroups from "~/components/Home/RenderingGroups";
import { Input } from "~/components/ui/input";
import Create_group_card_page from "~/components/reusable/group/Create_group_card_page";
import { useCreateGroupStore } from "~/store/useCreateGroupStore";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const { isCreateGroupOpen, onOpen } = useCreateGroupStore();

  //CHECK IF USER IS NEW OR NOT
  api.user.checkUser.useQuery();

  if (isLoaded && !isSignedIn) {
    router.push("/auth");
    return null;
  }
  if (!isLoaded) return <LoadingPage />;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gray-950">
        <div className="flex pt-24">
          <button
            className="flex flex-1 items-center justify-center text-white hover:bg-gray-800"
            onClick={() => onOpen()}
          >
            <GroupUserIcon />
            <span className="font-Rubik">Create group</span>
          </button>
          <div className="flex flex-1 items-center justify-center">
            <Input
              type="email"
              placeholder="Search..."
              className="h-[90%] w-[90%] bg-slate-900 text-white"
            />
          </div>
        </div>
        <RenderingGroups />
      </main>

      {isCreateGroupOpen == true && <Create_group_card_page />}
    </>
  );
}
