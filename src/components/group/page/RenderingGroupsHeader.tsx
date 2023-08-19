import { useCreateGroupStore } from "~/store/useCreateGroupStore";
import GroupUserIcon from "~/styles/icons/GroupUserIcon";
import { Input } from "~/components/ui/input";

type RenderingGroupHeaderProps = {
  setFilterSearchGroupText: (text: string) => void;
};

const RenderingGroupHeader = ({
  setFilterSearchGroupText,
}: RenderingGroupHeaderProps) => {
  const { onOpen } = useCreateGroupStore();

  return (
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
          className="w-[100%] bg-slate-900 text-white"
          onChange={(e) => setFilterSearchGroupText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default RenderingGroupHeader;
