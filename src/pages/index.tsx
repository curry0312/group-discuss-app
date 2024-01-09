import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Head from "next/head";
import RenderingHomeThread from "~/components/home/RenderingHomeThread";
import Navbar from "~/components/global/Navbar";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  //CHECK IF USER IS NEW OR NOT
  api.user.checkUser.useQuery();

  if (isLoaded && !isSignedIn) {
    router.push("/auth");
    return null;
  }
  return (
    <>
      <Head>
        <title>Group Discuss App</title>
        <meta name="description" content="A group discuss app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Navbar />
      <div className="flex min-h-screen w-screen flex-col pt-[106px] text-white bg-gray-950">
        <RenderingHomeThread />
      </div>
    </>
  );
}
