import RenderingGroups from "~/components/group/RenderingGroups";
import Create_group_card_page from "~/components/group/Create_group_card_page";
import { useCreateGroupStore } from "~/store/useCreateGroupStore";
import RenderingGroupHeader from "~/components/group/RenderingGroupsHeader";
import { useState } from "react";
import Navbar from "~/components/global/Navbar";

export default function groupPage() {
  const { isCreateGroupOpen } = useCreateGroupStore();
  const [filterSearchGroupText, setFilterSearchGroupText] = useState<string>("")

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-screen flex-col pt-[106px] bg-gray-950">
        <RenderingGroupHeader setFilterSearchGroupText={setFilterSearchGroupText}/>
        <RenderingGroups filterSearchGroupText={filterSearchGroupText}/>
      </div>

      {isCreateGroupOpen === true && <Create_group_card_page />}
    </>
  );
}
