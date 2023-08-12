import { Textarea } from "src/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import RenderingGroupPosts from "~/pages/post/[postId]/RenderingGroupPosts";
import { Input } from "~/components/ui/input";
import AddFriendsToGroupIcon from "~/styles/icons/AddUserIcon";
import {
  GetServerSidePropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSGHelper";

const formSchema = z.object({
  content: z.string().min(1, "You can't post empty content!"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const GroupPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {

  const { register, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

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
    <div className="min-h-screen bg-gray-950 pt-[86px] text-white">
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
      <RenderingGroupPosts groupId={props.groupId}/>
      <div className="fixed bottom-0 w-full bg-black bg-opacity-60 backdrop-blur">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <Textarea
            {...register("content")}
            placeholder="Type your post content here."
          />
          <Button type="submit">Post</Button>
        </form>
      </div>
    </div>
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
