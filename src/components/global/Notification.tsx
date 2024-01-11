import Image from "next/image";
import Link from "next/link";
import { useOpenNotification } from "~/store/useOpenNotification";
import { api } from "~/utils/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { AspectRatio } from "../ui/aspect-ratio";

const Notification = () => {
  const { data, isLoading } = api.user.getAllUnCheckedFriends.useQuery();
  console.log("allUnCheckedFriends:", data);
  const { isNotificationOpen, setIsNotificationOpen } = useOpenNotification();
  if (isLoading)
    return (
      <div
        className={
          isNotificationOpen == true
            ? "absolute inset-0  top-[86px] z-[999] flex h-screen items-center justify-center bg-white  duration-200 ease-in-out"
            : "absolute inset-0  top-[86px] z-[999] flex h-0 items-center justify-center overflow-hidden bg-white  duration-200 ease-in-out"
        }
      >
        <LoadingSpinner />
      </div>
    );
  if (!data) return <div>404 data not found</div>;
  return (
    <div
      className={
        isNotificationOpen == true
          ? "absolute inset-0  top-[86px] z-[999] h-screen bg-white  duration-200 ease-in-out"
          : "absolute inset-0  top-[86px] z-[999] h-0 overflow-hidden bg-white  duration-200 ease-in-out"
      }
    >
      <h1 className="p-4 font-Rubik text-2xl font-bold">Notification</h1>
      <div className="flex flex-col">
        {data[0]?.unCheckedFriends.map((unCheckedFriend) => {
          return (
            <Link
              key={unCheckedFriend.id}
              href={`/profile/${unCheckedFriend.id}`}
              className="flex items-start gap-3 p-4 hover:bg-blue-100"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <div>
                <div className="w-[60px] rounded-full">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={unCheckedFriend.image!}
                      alt="user-image"
                      className="rounded-full object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </AspectRatio>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <p className="font-bold">{unCheckedFriend.name}</p>
                <p>has sent you a friend request</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Notification;
