import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Create_group_card from "~/components/reusable/group/Create_group_card";
import LoadingPage from "~/components/reusable/loading/LoadingPage";
import Navbar from "~/components/global/Navbar";
import { api } from "~/utils/api";
import RenderingGroups from "~/components/Home/RenderingGroups";
import { Input } from "~/components/ui/input";
import GroupUserIcon from "~/styles/icons/GroupUser";


export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

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
        <Navbar />
        <div className="flex pt-24">
          <button className="flex flex-1 items-center justify-center text-white hover:bg-gray-800">
            <GroupUserIcon />
            <span className="font-Rubik">Create group</span>
          </button>
          <div className="flex-1 flex justify-center items-center">
            <Input
              type="email"
              placeholder="Search..."
              className="h-[90%] w-[90%] bg-slate-900 text-white"
            />
          </div>
        </div>
        <RenderingGroups />
      </main>
      {/* <div className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 md:w-[50%] lg:w-[30%]">
        <Create_group_card />
      </div> */}
    </>
  );
}
