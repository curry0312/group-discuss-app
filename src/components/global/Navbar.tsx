import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "src/components/ui/avatar";

import ChatIcon from "~/styles/icons/ChatIcon";
import HomeIcon from "~/styles/icons/HomeIcon";
import PersonIcon from "~/styles/icons/PersonIcon";
import NotificationIcon from "~/styles/icons/NotificationIcon";
import { useOpenNotification } from "~/store/useOpenNotification";
import Notification from "./Notification";
import { Skeleton } from "../ui/skeleton";
import ProfileIcon from "~/styles/icons/ProfileIcon";
import SettingIcon from "~/styles/icons/SettingIcon";
import SignOutIcon from "~/styles/icons/SignOutIcon";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const currentPath = usePathname();
  const router = useRouter();
  const [pathname, setPathname] = useState("/");
  const { isNotificationOpen, setIsNotificationOpen } = useOpenNotification();
  useEffect(() => {
    setPathname(currentPath);
  }, [currentPath]);
  return (
    <>
      <nav
        className={
          pathname !== "/auth" && !pathname.includes("/sign-in")
            ? "fixed z-50 flex w-full items-center justify-between bg-black bg-opacity-50 p-4 backdrop-blur"
            : "hidden"
        }
      >
        {/*nav route links*/}
        <div>
          <ul className="flex items-center gap-2">
            <li className={pathname === "/" ? "border-b-2 border-white" : ""}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="/"
                      className="flex flex-col items-center sm:flex-row"
                    >
                      <HomeIcon />
                      <span className="text-white">Home</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
            <li
              className={pathname === "/group" ? "border-b-2 border-white" : ""}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="/group"
                      className="flex flex-col items-center sm:flex-row"
                    >
                      <ChatIcon />
                      <span className="text-white">Groups</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Groups</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
            <li
              className={pathname === "/users" ? "border-b-2 border-white" : ""}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="/users"
                      className="flex flex-col items-center sm:flex-row"
                    >
                      <PersonIcon />
                      <span className="text-white">Users</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Users</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        </div>
        {/*user profile button*/}
        {!isLoaded ? (
          <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
        ) : (
          <div className="flex flex-row-reverse items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto mr-2">
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="flex items-center gap-1"
                  onClick={() => router.push(`/profile/${user?.id}`)}
                >
                  <ProfileIcon />
                  <Link href={`/profile/${user?.id}`}>profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-1"
                  onClick={() => router.push(`/setting/${user?.id}`)}
                >
                  <SettingIcon />
                  <Link href={"/setting/userId"}>setting</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-1">
                  <SignOutIcon />
                  <SignOutButton>Sign out</SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              <NotificationIcon />
            </div>
          </div>
        )}
      </nav>
      {isSignedIn == true && <Notification />}
    </>
  );
};

export default Navbar;
