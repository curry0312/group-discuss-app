import { Textarea } from "src/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import RenderingGroupPosts from "~/components/reusable/post/RenderingGroupPosts";
import { Input } from "~/components/ui/input";
import AddFriendsToGroupIcon from "~/styles/icons/AddUserIcon";
import {
  GetServerSidePropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSGHelper";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CloseIcon from "~/styles/icons/CloseIcon";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import PictureIcon from "~/styles/icons/PictureIcon";

const formSchema = z.object({
  content: z.string().min(1, "You can't post empty content!"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const GroupPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { user } = useUser();

  const { register, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const postCreateGenerator = api.post.createPost.useMutation();

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    postCreateGenerator.mutate(
      {
        content: data.content,
        groupId: props.groupId,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <>
      <div className={"min-h-screen bg-gray-950 pt-[86px] text-white"}>
        <div className="flex">
          <button
            className="flex flex-1 items-center justify-center gap-2 text-white hover:bg-gray-800"
            onClick={() => {}}
          >
            <AddFriendsToGroupIcon />
            <span className="font-Rubik">Invite</span>
          </button>
          <div className="flex flex-1 items-center justify-center">
            <Input
              type="email"
              placeholder="Search..."
              className="h-[90%] bg-slate-900 text-white"
            />
          </div>
        </div>
        <RenderingGroupPosts groupId={props.groupId} />
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="fixed bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 hover:scale-110"
        >
          <PlusIcon className="h-8 w-8 text-white" />
        </button>
      </div>

      <div
        className={
          isCreatePostOpen === true
            ? "fixed inset-0 bg-black bg-opacity-60 backdrop-blur"
            : "fixed bg-black bg-opacity-60 backdrop-blur"
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-500"
            >
              <CloseIcon />
            </button>
            <Button variant={"outline"} type="submit">
              Post
            </Button>
          </div>
          <div>
            <div className="pl-4">
              <Avatar>
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </div>
            <div className="p-2">
              <Textarea
                {...register("content")}
                rows={6}
                placeholder="What you like to say now?"
                className="mt-2 resize-none border-none text-white outline-none ring-0 focus:outline-none"
              />
            </div>
            {/*post image feature*/}
            {/* <div className="flex items-center justify-around">
              <input type="file" id="picture" className="hidden"/>
              <label htmlFor="picture">
                <PictureIcon />
              </label>
            </div> */}
          </div>
        </form>
      </div>
    </>
  );
};

export default GroupPage;

export async function getStaticProps(
  context: GetServerSidePropsContext<{ groupId: string }>
) {
  const helpers = generateSSGHelper();
  const groupId = context.params?.groupId as string;
  if (typeof groupId !== "string") throw new Error("no userId");
  // prefetch `post.getAllGroupPosts`
  await helpers.post.getAllGroupPosts.prefetch({ groupId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      groupId,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
