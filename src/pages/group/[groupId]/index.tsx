import { Textarea } from "src/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import RenderingGroupPosts from "~/components/Home/RenderingGroupPosts";

const formSchema = z.object({
  content: z.string().min(1, "You can't post empty content!"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const GroupPage = () => {
  const { register, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const postCreateGenerator = api.post.createPost.useMutation();

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    postCreateGenerator.mutate(
      {
        content: data.content,
        groupId: String(router.query.groupId),
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-24 text-white">
      <RenderingGroupPosts />
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
