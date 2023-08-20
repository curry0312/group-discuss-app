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
        className="relative flex flex-1 items-center justify-center text-white group"
        onClick={() => onOpen()}
      >
        <GroupUserIcon />
        <span className="font-Rubik">Create group</span>
        <div className="hidden absolute bottom-0 w-full h-0.5 text-white bg-white group-hover:block"/>
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
