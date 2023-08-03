import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center z-50">
      <SignUp />
    </div>
  );
}
