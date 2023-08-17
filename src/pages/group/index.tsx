import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Head from "next/head";

import GroupUserIcon from "~/styles/icons/GroupUserIcon";
import RenderingGroups from "~/components/group/page/RenderingGroups";
import { Input } from "~/components/ui/input";
import Create_group_card_page from "~/components/group/page/Create_group_card_page";
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
  return (
    <>
      <div className="flex min-h-screen w-screen flex-col pt-[86px] bg-gray-950">
        <div className="flex">
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
      </div>

      {isCreateGroupOpen == true && <Create_group_card_page />}
    </>
  );
}
