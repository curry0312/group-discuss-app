import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Skeleton } from "~/components/ui/skeleton";

import ChevronLeftIcon from "~/styles/icons/ChevronLeftIcon";
import InViteFriendToGroup from "../../group/page/InviteFriendToGroup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useUser } from "@clerk/nextjs";

type GroupHeaderPropsType = {
  groupId: string;
};

const RenderingGroupPostsHeader = ({ groupId }: GroupHeaderPropsType) => {
  const { user } = useUser();
  const router = useRouter();
  const { data, isLoading } = api.group.getGroup.useQuery({
    groupId: groupId,
  });

  const deleteGroupGenerator = api.group.deleteGroup.useMutation();

  if (isLoading) {
    return (
      <div className="flex h-[86px] items-center justify-between bg-gray-950 p-4 text-white">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-12 rounded-md bg-gray-900" />
          <Skeleton className="h-6 w-16 rounded-md bg-gray-900" />
        </div>
        <div>
          <Skeleton className="h-10 w-20 rounded-md bg-gray-900" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-[86px] items-center justify-between bg-gray-950 p-4 text-white">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon />
        </button>
        <h1 className="text-lg">{data?.name}</h1>
        <span className="text-md">({Number(data?.members.length)}) </span>
        <div className="flex items-center">
          {data?.members.map((member) => (
            <div
              key={member.id}
              className="w-[30px] cursor-pointer"
              onClick={() => router.push(`/profile/${member.id}`)}
            >
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={member.image}
                  alt="Image"
                  className="rounded-full object-cover"
                  fill
                />
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <InViteFriendToGroup groupId={groupId} />
        {data?.ownerId === user?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} className="">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your group and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteGroupGenerator.mutate(
                      { groupId: groupId },
                      {
                        onSuccess: () => {
                          router.back();
                        },
                      }
                    );
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default RenderingGroupPostsHeader;
