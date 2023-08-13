import { group } from "console";
import CloseIcon from "~/styles/icons/CloseIcon";
import { api } from "~/utils/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import InviteEachFriend from "./InviteEachFriend";

type InViteFriendToGroupPropsType = {
  isInviteFriendToGroupOpen: boolean;
  setIsInviteFriendToGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
};

const InViteFriendToGroup = ({
  isInviteFriendToGroupOpen,
  setIsInviteFriendToGroupOpen,
  groupId
}: InViteFriendToGroupPropsType) => {
  const friends = api.user.getAllFriends.useQuery();
  const friendsOf = api.user.getAllFriendsOf.useQuery();
  if (friends.isLoading || friendsOf.isLoading)
    return (
      <div
        className={
          isInviteFriendToGroupOpen == true
            ? "fixed inset-10 z-[999] rounded-xl bg-white  duration-200 ease-in-out"
            : "fixed z-[999] hidden overflow-hidden bg-white  duration-200 ease-in-out"
        }
      >
        <LoadingSpinner />
      </div>
    );
  if (!friends.data || !friendsOf.data) return <div>404 data not found</div>;
  return (
    <div
      className={
        isInviteFriendToGroupOpen == true
          ? "fixed inset-10 z-[999] rounded-xl bg-white  duration-200 ease-in-out"
          : "fixed z-[999] hidden overflow-hidden bg-white  duration-200 ease-in-out"
      }
    >
      <div className="flex items-center justify-between px-4">
        <h1 className="p-4 font-Rubik text-2xl font-bold">Invite friends</h1>
        <button onClick={() => setIsInviteFriendToGroupOpen(false)}>
          <CloseIcon className="text-black" />
        </button>
      </div>
      <div className="flex flex-col">
        {friends.data[0]?.friends.map((friend) => {
          return (
            <InviteEachFriend key={friend.id} friend={friend} setIsInviteFriendToGroupOpen={setIsInviteFriendToGroupOpen} groupId={groupId}/>
          );
        })}
        {friendsOf.data[0]?.friendsOf.map((friend) => {
          return (
            <InviteEachFriend key={friend.id} friend={friend} setIsInviteFriendToGroupOpen={setIsInviteFriendToGroupOpen} groupId={groupId}/>
          );
        })}
      </div>
    </div>
  );
};

export default InViteFriendToGroup;
