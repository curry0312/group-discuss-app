"use client";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";

import ChatIcon from "~/styles/icons/Chat";
import HomeIcon from "~/styles/icons/Home";
import PersonIcon from "~/styles/icons/Person";
import { Button } from "../ui/button";

const Navbar = () => {
  const { user } = useUser();
  const a = usePathname();
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    setPathname(a);
  }, [a]);
  console.log(a);
  return (
    <nav className="fixed flex w-full items-center justify-between border-b border-stone-900 p-4">
      {/*nav route links*/}
      <div>
        <ul className="flex items-center gap-2">
          <li className={pathname === "/" ? "border-b-2 border-white" : ""}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/">
                    <HomeIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li
            className={pathname === "/friends" ? "border-b-2 border-white" : ""}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/friends">
                    <PersonIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Friends</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li className={pathname === "/chat" ? "border-b-2 border-white" : ""}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/chat">
                    <ChatIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Groups</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>
      {/*user profile button*/}
      <div className="flex flex-row-reverse gap-2">
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default Navbar;
