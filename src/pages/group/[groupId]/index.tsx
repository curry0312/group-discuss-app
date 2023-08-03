import GroupPost from "~/components/reusable/group/GroupPost";
import { Textarea } from "src/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent } from "react";
import { api } from "~/utils/api";

const formSchema = z.object({
  postContent: z.string().min(1, "You can't post empty content!"),
});

type FormSchemaType = z.infer<typeof formSchema>;
const GroupChat = () => {
  const {register, handleSubmit, reset} = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  })
  function onSubmit(e:any) {
    e.preventDefault()
  }
  return (
    <div className="min-h-screen bg-gray-950 pt-24 text-white">
      <GroupPost />
      <GroupPost />
      <GroupPost />

      <div className="fixed bottom-0 flex w-full gap-2 p-2 bg-black bg-opacity-60 backdrop-blur">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textarea {...register("postContent")} placeholder="Type your post content here." />
          <Button type="submit">Post</Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
