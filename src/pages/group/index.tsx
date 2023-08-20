import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import RenderingGroups from "~/components/group/page/RenderingGroups";
import Create_group_card_page from "~/components/group/page/Create_group_card_page";
import { useCreateGroupStore } from "~/store/useCreateGroupStore";
import RenderingGroupHeader from "~/components/group/page/RenderingGroupsHeader";
import { useState } from "react";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { isCreateGroupOpen } = useCreateGroupStore();
  const [filterSearchGroupText, setFilterSearchGroupText] = useState<string>("")

  //CHECK IF USER IS NEW OR NOT
  api.user.checkUser.useQuery();

  if (isLoaded && !isSignedIn) {
    router.push("/auth");
    return null;
  }
  return (
    <>
      <div className="flex min-h-screen w-screen flex-col pt-[106px] bg-gray-950">
        <RenderingGroupHeader setFilterSearchGroupText={setFilterSearchGroupText}/>
        <RenderingGroups filterSearchGroupText={filterSearchGroupText}/>
      </div>

      {isCreateGroupOpen == true && <Create_group_card_page />}
    </>
  );
}
