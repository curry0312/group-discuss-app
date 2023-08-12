import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import AddFriendsToGroupIcon from "~/styles/icons/AddUserIcon";
import CheckedIcon from "~/styles/icons/CheckedIcon";
import EditIcon from "~/styles/icons/EditIcon";
import MinusUser from "~/styles/icons/MinusUserIcon";
import { api } from "~/utils/api";

type FriendStateButtonsPropsType = {
  profileUserInfo: User;
};
const FriendStateButtons = ({
  profileUserInfo,
}: FriendStateButtonsPropsType) => {
  const { user, isLoaded } = useUser();
  const ctx = api.useContext();

  const isInUncheckedRelationship = api.user.isInUncheckedRelationship.useQuery(
    {
      id: profileUserInfo.id,
    }
  );
  const isCurrentUserUncheckedFriend =
    api.user.isCurrentUserUncheckedFriend.useQuery({
      id: profileUserInfo.id,
    });

  const isInFriendRelationship = api.user.isInFriendRelationship.useQuery({
    id: profileUserInfo.id,
  });

  const addUnCheckedFriend = api.user.addUnCheckedFriend.useMutation();
  const deleteUnCheckedFriend = api.user.deleteUnCheckedFriend.useMutation();
  const addFriend = api.user.addFriend.useMutation();
  const deleteFriend = api.user.deleteFriend.useMutation();

  function handleSendFriendRequest() {
    addUnCheckedFriend.mutate(
      {
        id: profileUserInfo.id,
      },
      {
        onSuccess: (e) => {
          ctx.user.invalidate();
          console.log(`sent friend invitation to ${profileUserInfo?.name}`);
          console.log(
            `${profileUserInfo?.name} have an unChecked friend name's ${user?.lastName}`
          );
        },
      }
    );
  }
  async function handleConfirmFriendRequest() {
    await addFriend.mutateAsync({
      id: profileUserInfo.id,
    });
    await deleteUnCheckedFriend
      .mutateAsync({ id: profileUserInfo.id })
      .then(() => {
        ctx.user.invalidate();
      });
  }

  if (isInUncheckedRelationship.isLoading || isInFriendRelationship.isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }
  if (isInUncheckedRelationship.data) {
    if (!isCurrentUserUncheckedFriend.data) {
      return (
        <Button
          onClick={() => handleConfirmFriendRequest()}
          variant="outline"
          className="flex items-center gap-1 bg-gray-800"
        >
          <AddFriendsToGroupIcon />
          <span>Confirm</span>
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => handleConfirmFriendRequest()}
          className="flex items-center gap-1 bg-gray-800"
        >
          <MinusUser />
          <span>Cancel Ruquest</span>
        </Button>
      );
    }
  }
  if (isInFriendRelationship.data) {
    return (
      <Button
        onClick={() => {}}
        className="flex items-center gap-1 bg-gray-800"
      >
        <CheckedIcon />
        <span>Friend</span>
      </Button>
    );
  }
  if (!!isLoaded && profileUserInfo.id === user?.id) {
    return (
      <Button
        onClick={() => handleSendFriendRequest()}
        variant={"outline"}
        className="flex items-center gap-1 bg-gray-800"
      >
        <EditIcon />
        <span>Edit profile</span>
      </Button>
    );
  }
  return (
    <Button
      onClick={() => handleSendFriendRequest()}
      className="flex items-center gap-1 bg-gray-800"
    >
      <AddFriendsToGroupIcon />
      <span>Add friend</span>
    </Button>
  );
};

export default FriendStateButtons;
