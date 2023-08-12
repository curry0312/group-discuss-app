import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen z-50">
      <SignIn path="/sign-in" routing="path" afterSignInUrl={"/"}/>
    </div>
  )
}