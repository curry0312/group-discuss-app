import { Group } from "@prisma/client";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

type groupTypesProps = {
    group: Group;
  };
  
  const Group = ({ group }: groupTypesProps) => {
    dayjs.extend(relativeTime);
    return (
      <Link href={`/group/${group.id}`} key={group.id} className="flex gap-1 font-Rubik text-white hover:bg-gray-800">
        <div className="basis-1/5">
          <div className="flex items-center justify-center p-2">
            <div className="w-[64px] rounded-full">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={group.image}
                  alt="group-image"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
        <div className="flex basis-4/5 flex-col justify-center">
          <p className="text-xl">{group.name}</p>
          <p>created {dayjs(group.createdAt).toNow()}</p>
        </div>
      </Link>
    );
  };
  
export default Group