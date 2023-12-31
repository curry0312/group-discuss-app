import User from "~/components/user/reuse/User";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useSearchUsersText } from "~/store/useSearchUsersText";
import Navbar from "~/components/global/Navbar";

const Friends = () => {
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  const { searchUsersText, setSearchUsersText } = useSearchUsersText();

  const filteredUsers = data?.filter((user:any) => {
    if (user.name.toLowerCase().includes(searchUsersText?.toLowerCase()))
      return true;
    return false;
  });
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950">
        <div className="pt-[106px]">
          <div className="flex flex-1 items-center justify-center p-2">
            <Input
              type="email"
              placeholder="Search users..."
              className="w-[90%] bg-slate-900 text-white"
              onChange={setSearchUsersText}
              value={searchUsersText}
            />
          </div>
          <div className="flex flex-col">
            {searchUsersText.length > 0
              ? filteredUsers?.map((user:any) => <User key={user.id} user={user} />)
              : data?.map((user:any) => <User key={user.id} user={user} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;
