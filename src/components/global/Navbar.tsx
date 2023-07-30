import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import ChatIcon from "~/styles/icons/Chat";
import HomeIcon from "~/styles/icons/Home";
import PersonIcon from "~/styles/icons/Person";

const Navbar = () => {
  return (
    <nav className="fixed flex w-full items-center justify-between p-4 border-b border-stone-900">
      {/*nav route links*/}
      <div>
        <ul className="flex items-center gap-2">
          <li>
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
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/">
                    <PersonIcon />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Friends</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link href="/">
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
      <div>
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
