import { User } from "@prisma/client";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CommandItem } from "~/components/ui/command";
import { api } from "~/utils/api";

type InviteEachFriendPropsType = {
  friend: User;
  groupId: string;
  selectFriends: User[];
  setSelectFriends: React.Dispatch<React.SetStateAction<User[]>>;
};

const InviteEachFriend = ({
  friend,
  groupId,
  selectFriends,
  setSelectFriends,
}: InviteEachFriendPropsType) => {

  function handleSelectFriend(){
    if(selectFriends.find((selectFriend) => selectFriend.id === friend.id)){
      setSelectFriends(selectFriends.filter((selectFriend) => selectFriend.id !== friend.id))
    }else{
      setSelectFriends([...selectFriends, friend])
    }

  }
  return (
    <div
      key={friend.id}
      className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-slate-100"
      onClick={() => handleSelectFriend()}
    >
      <div className="flex items-center gap-2">
        <Image
          src={friend.image}
          alt={`${friend.name}-image`}
          width={40}
          height={40}
          priority
          className="rounded-full object-cover"
        />
        <CommandItem>{friend.name}</CommandItem>
      </div>
      {selectFriends.find((selectFriend) => selectFriend.id === friend.id) ? (
        <div>
          <CheckIcon />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default InviteEachFriend;
