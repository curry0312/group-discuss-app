import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

const formSchema = z.object({
  content: z.string().min(1, "You can't post empty content!"),
});

type FormSchemaType = z.infer<typeof formSchema>;

type CreateCommentProps = {
  isCreateCommentOpen: boolean;
  setIsCreateCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
};

const CreateComment = ({
  isCreateCommentOpen,
  setIsCreateCommentOpen,
  postId,
}: CreateCommentProps) => {

  const { register, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const ctx = api.useContext();

  const {data: userData} = api.user.getCurrentUser.useQuery()

  const commentCreateGenerator = api.comment.createComment.useMutation();

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    commentCreateGenerator.mutate(
      {
        content: data.content,
        postId: postId,
      },
      {
        onSuccess: () => {
          ctx.post.invalidate()
          reset();
        },
      }
    );
  };
  return (
    <div
      className={
        isCreateCommentOpen === true
          ? "fixed right-0 left-0 h-[40%] bottom-0 bg-white"
          : "fixed hidden bg-white"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            onClick={() => setIsCreateCommentOpen(false)}
            variant={"destructive"}
          >
            Cancel
          </Button>
          <Button variant={"default"} type="submit" onClick={()=>setIsCreateCommentOpen(false)}>
            Comment
          </Button>
        </div>
        <div>
          <div className="pl-4">
          <div className="w-[50px] rounded-full">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={userData?.image!}
                    alt="user-image"
                    className="rounded-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </AspectRatio>
              </div>
          </div>
          <div className="p-2">
            <Textarea
              {...register("content")}
              rows={7}
              placeholder="What do you like to say now?"
              className="mt-2 resize-none border-none text-gray-950 outline-none ring-0 focus:outline-none"
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

export default CreateComment;
