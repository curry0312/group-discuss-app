import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import AddUserIcon from "~/styles/icons/AddUserIcon";

type InViteFriendToGroupProps = {
  groupId: string;
};

const InViteFriendToGroup = ({ groupId }: InViteFriendToGroupProps) => {
  const [selectFriends, setSelectFriends] = useState<User[]>([]);
  const friends = api.user.getAllUnGroupedFriends.useQuery({
    groupId: groupId,
  });
  const friendsOf = api.user.getAllUnGroupedFriendsOf.useQuery({
    groupId: groupId,
  });
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

  if (friends.isLoading || friendsOf.isLoading) {
    return <Skeleton className="h-10 w-20 rounded-md bg-gray-900" />;
  }
  if (!friends.data || !friendsOf.data) {
    return <div>404 data not found</div>;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-md">
          <AddUserIcon />
          <span>Invite</span>
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
