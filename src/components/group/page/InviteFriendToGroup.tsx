import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "~/components/ui/command";

import { api } from "~/utils/api";
import InviteEachFriend from "./InviteEachFriend";
import { useState } from "react";
import { User } from "@prisma/client";
import { Skeleton } from "~/components/ui/skeleton";

type InViteFriendToGroupPropsType = {
  groupId: string;
};

const InViteFriendToGroup = ({ groupId }: InViteFriendToGroupPropsType) => {
  const [selectFriends, setSelectFriends] = useState<User[]>([]);
  const friends = api.user.getAllFriends.useQuery();
  const friendsOf = api.user.getAllFriendsOf.useQuery();
  const ctx = api.useContext();
  const inviteFriendToGroup = api.group.inviteFriendToGroup.useMutation();
  async function handleInviteFriendToGroup() {
    try {
      await inviteFriendToGroup.mutateAsync({
        id: groupId,
        userIds: selectFriends.map((friend) => friend.id),
      });
      ctx.group.invalidate();
    } catch (error) {
      console.log(error);
    }
  }
  if (friends.isLoading || friendsOf.isLoading)
    return (
      <>
        <Skeleton className="h-10 w-28 rounded-md bg-gray-900" />
      </>
    );
  if (!friends.data || !friendsOf.data) return <div>404 data not found</div>;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gray-900 text-white">
          Invite friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select friends</DialogTitle>
          <DialogDescription>
            Invite a user to this thread. This will create a new group message.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No friends found.</CommandEmpty>
            <CommandGroup>
              {friends.data[0]?.friends.map((friend) => {
                return (
                  <InviteEachFriend
                    key={friend.id}
                    friend={friend}
                    groupId={groupId}
                    selectFriends={selectFriends}
                    setSelectFriends={setSelectFriends}
                  />
                );
              })}
              {friendsOf.data[0]?.friendsOf.map((friend) => {
                return (
                  <InviteEachFriend
                    key={friend.id}
                    friend={friend}
                    groupId={groupId}
                    selectFriends={selectFriends}
                    setSelectFriends={setSelectFriends}
                  />
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex justify-between">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => handleInviteFriendToGroup()}>
            <Button variant="outline">Invite</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InViteFriendToGroup;
