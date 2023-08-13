import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import CloseIcon from "~/styles/icons/CloseIcon";
import { api } from "~/utils/api";

const formSchema = z.object({
  content: z.string().min(1, "You can't post empty content!"),
});
type FormSchemaType = z.infer<typeof formSchema>;

type CreateGroupPostPropsType = {
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
};

const CreateGroupPost = ({
  isCreatePostOpen,
  setIsCreatePostOpen,
  groupId,
}: CreateGroupPostPropsType) => {
  const { user } = useUser();

  const { register, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const postCreateGenerator = api.post.createPost.useMutation();
  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    postCreateGenerator.mutate(
      {
        content: data.content,
        groupId: groupId,
      },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };
  return (
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
  );
};

export default CreateGroupPost;
