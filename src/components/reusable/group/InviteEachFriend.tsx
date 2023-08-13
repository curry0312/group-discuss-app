import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

type InviteEachFriendPropsType = {
  friend: User;
  setIsInviteFriendToGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
};

const InviteEachFriend = ({
  friend,
  setIsInviteFriendToGroupOpen,
  groupId,
}: InviteEachFriendPropsType) => {
  const ctx = api.useContext();
  const inviteFriendToGroup = api.group.inviteFriendToGroup.useMutation();
  async function handleInviteFriendToGroup() {
    try {
      await inviteFriendToGroup.mutateAsync({
        id: groupId,
        userId: friend.id,
      });
      ctx.group.invalidate();
      setIsInviteFriendToGroupOpen(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div key={friend.id} className="flex items-center hover:bg-gray-100">
      <Link
        href={`/profile/${friend.id}`}
        className="flex flex-1 items-center gap-3 p-4"
        onClick={() => setIsInviteFriendToGroupOpen(false)}
      >
        <div>
          <Image
            src={friend.image}
            alt={`${friend.name}-image`}
            width={50}
            height={50}
            priority
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex gap-3">
          <p className="font-bold">{friend.name}</p>
        </div>
      </Link>
      <div className="px-4">
        <Button
          variant={"outline"}
          className="bg-gray-900 text-white"
          onClick={() => handleInviteFriendToGroup()}
        >
          Invite
        </Button>
      </div>
    </div>
  );
};

export default InviteEachFriend;
