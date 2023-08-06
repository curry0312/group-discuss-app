import { useState } from "react";
import User from "~/components/reusable/user/User";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Friends = () => {
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  const [filteredText, setFilteredText] = useState<string>("");

  const filteredUsers = data?.filter((user) => {
    if (user.name.toLowerCase().includes(filteredText?.toLowerCase()))
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
            onChange={(e) => {
              setFilteredText(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col">
          {filteredText.length > 0 ? (
            filteredUsers?.map((user) => <User user={user} />)
          ) : (
            <div className="text-center mt-5">
              <p className="text-gray-400 font-Rubik">Try searching for people</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
