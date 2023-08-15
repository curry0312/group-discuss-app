import User from "~/components/reusable/user/User";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useSearchUsersText } from "~/store/useSearchUsersText";

const Friends = () => {
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  const { searchUsersText, setSearchUsersText } = useSearchUsersText();

  const filteredUsers = data?.filter((user) => {
    if (user.name.toLowerCase().includes(searchUsersText?.toLowerCase()))
      return true;
    return false;
  });
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="pt-24">
        <div className="flex flex-1 items-center justify-center p-2">
          <Input
            type="email"
            placeholder="Search users..."
            className="w-[90%] bg-slate-900 text-white"
            onChange={setSearchUsersText}
            value={searchUsersText}
            // defaultValue={searchUsersText || ""}
          />
        </div>
        <div className="flex flex-col">
          {searchUsersText.length > 0 ? (
            filteredUsers?.map((user) => <User key={user.id} user={user} />)
          ) : (
            <div className="mt-5 text-center">
              <p className="font-Rubik text-gray-400">
                Try searching for people
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
