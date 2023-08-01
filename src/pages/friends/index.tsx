import Image from "next/image";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";

const Friends = () => {
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  return (
    <main className="min-h-screen bg-gray-950 pt-24">
      <div className="">
        <div className="flex flex-1 items-center justify-center p-2">
          <Input
            type="email"
            placeholder="Search..."
            className="w-[90%] bg-slate-900 text-white"
          />
        </div>
        <div className="flex flex-col gap-3 p-2">
          {data?.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 font-Rubik text-white"
            >
              <div className="basis-1/5">
                <div className="w-[60px] rounded-full">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={"https://github.com/shadcn.png"}
                      alt="group-image"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-full object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>
              <div className="basis-4/5">
                <div className="flex flex-col gap-1">
                  <p>{user.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Friends;
