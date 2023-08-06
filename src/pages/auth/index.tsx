import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const Auth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  console.log(user);
  if (isLoaded && isSignedIn) {
    router.push("/");
    return null;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950 z-[999]">
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="font-Rubik text-xl text-white">
          Welcome to group-discuss-app
        </p>
        <p className="font-Rubik text-xl text-white">Sign in to use this app</p>
        <div>
          <SignInButton>
            <Button variant="secondary">Sign in</Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default Auth;
