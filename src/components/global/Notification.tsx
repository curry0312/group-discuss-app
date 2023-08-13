import Image from "next/image";
import Link from "next/link";
import { useOpenNotification } from "~/store/useOpenNotification";
import { api } from "~/utils/api";
import LoadingSpinner from "../reusable/loading/LoadingSpinner";

const Notification = () => {
  const { data, isLoading } = api.user.getAllUnCheckedFriends.useQuery();
  console.log("allUnCheckedFriends", data);
  const { isNotificationOpen, setIsNotificationOpen } = useOpenNotification();
  if (isLoading)
    return (
      <div
        className={
          isNotificationOpen == true
            ? "absolute inset-0  top-[86px] z-[999] flex justify-center items-center h-screen bg-white  duration-200 ease-in-out"
            : "absolute inset-0  top-[86px] z-[999] flex justify-center items-center h-0 overflow-hidden bg-white  duration-200 ease-in-out"
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
                <Image
                  src={unCheckedFriend.image}
                  alt={`${unCheckedFriend.name}-image`}
                  width={50}
                  height={50}
                  priority
                  className="rounded-full object-cover"
                />
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
