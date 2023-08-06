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
import { Avatar, AvatarImage } from "src/components/ui/avatar";

import ChatIcon from "~/styles/icons/ChatIcon";
import HomeIcon from "~/styles/icons/HomeIcon";
import PersonIcon from "~/styles/icons/PersonIcon";
import { Button } from "../ui/button";
import LoadingPage from "../reusable/loading/LoadingPage";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const a = usePathname();
  const [pathname, setPathname] = useState("/");
  useEffect(() => {
    setPathname(a);
  }, [a]);
  console.log("currentPath",a);
  if(!isLoaded) return <LoadingPage />;
  return (
    <nav className={"fixed flex w-full items-center justify-between bg-black bg-opacity-50 backdrop-blur p-4"}>
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
            className={pathname === "/users" ? "border-b-2 border-white" : ""}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/users">
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
        </Avatar>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default Navbar;
