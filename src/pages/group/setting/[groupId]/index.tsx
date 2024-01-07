import { Loader2 } from "lucide-react";
import { Button } from "src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Input } from "src/components/ui/input";
import { Switch } from "src/components/ui/switch";
import { useToast } from "src/components/ui/use-toast";

import { useForm, SubmitHandler } from "react-hook-form";
import { boolean, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";

// You need to import our styles for the button to look right. Best to import in the root /_app.tsx but this is fine
import "@uploadthing/react/styles.css";
import { UploadButton } from "~/utils/uploadthing";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import generateSSGHelper from "~/utils/generateSSRHelper";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import ArrowLeftIcon from "~/styles/icons/ArrowLeftIcon";

const formSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  public: z.boolean(),
  image: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const SettingPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const ctx = api.useContext();
  const { data } = api.group.getGroup.useQuery({
    id: props.groupId,
  });
  const groupUpdateGenerator = api.group.updateGroup.useMutation();
  const deleteGroupGenerator = api.group.deleteGroup.useMutation();
  const removeUserFromGroupGenerator =
    api.group.removeUserFromGroup.useMutation();

  const { user } = useUser();

  const router = useRouter();

  const { toast } = useToast();

  const [previewImage, setPreviewImage] = useState<string | undefined>("");

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.reset({
      name: data?.name,
      public: data?.public,
      image: data?.image,
    });
    setPreviewImage(data?.image);
    console.log(data);
  }, [data]);

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    groupUpdateGenerator.mutate(
      { ...data, id: props.groupId, image: previewImage! },
      {
        onSuccess: (newGroup) => {
          console.log(newGroup);
          toast({
            description: "Group update successfully!",
          });
          ctx.group.getAllUserMemberGroups.invalidate(); //refresh the rendering post section
        },
      }
    );
  };

  return (
    <Card className="min-h-screen rounded-none">
      <CardHeader>
        <button onClick={() => router.back()}>
          <ArrowLeftIcon />
        </button>
        <CardTitle className="text-xl font-extrabold">Setting</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the group name..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-col rounded-lg">
                  <div>
                    <FormLabel>Public</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    You can make your group public, so others can find it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col rounded-lg">
                  <FormLabel className="w-auto">Group Image</FormLabel>
                  <FormControl>
                    <div className="flex w-full justify-center">
                      <div className="w-[200px] rounded-full">
                        <AspectRatio ratio={1 / 1}>
                          <Image
                            src={
                              previewImage ||
                              field.value ||
                              "https://github.com/shadcn.png"
                            }
                            alt="group-image"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-center text-xs">
                    Upload your group image
                  </FormDescription>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      // Do something with the response
                      console.log("Files: ", res);
                      toast({
                        description: "Image uploaded successfully!",
                      });
                      if (res) {
                        setPreviewImage(res[0]?.fileUrl);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      // Do something with the error.
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3 rounded-md border border-gray-600">
              {data?.members.map((member) => {
                if (member.id !== user?.id) {
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          key={member.id}
                          className="w-[30px] cursor-pointer"
                          onClick={() => router.push(`/profile/${member.id}`)}
                        >
                          <AspectRatio ratio={1 / 1}>
                            <Image
                              src={member.image}
                              alt="Image"
                              className="rounded-full object-cover"
                              fill
                            />
                          </AspectRatio>
                        </div>
                        <div>{member.name}</div>
                      </div>
                      <div>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            removeUserFromGroupGenerator.mutate({
                              id: props.groupId,
                              userId: member.id,
                            },{
                              onSuccess: () => {
                                ctx.group.getGroup.invalidate();
                                toast({
                                  description: "User has been removed...",
                                });
                              }
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end">
            <Button
              variant="outline"
              type="submit"
              disabled={groupUpdateGenerator.isLoading}
              onClick={() => {
                toast({
                  description: "Editing...",
                });
              }}
            >
              {!!groupUpdateGenerator.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
      {data?.ownerId === user?.id && (
        <div className="mx-6 my-4 rounded-md border border-red-700 px-8 py-4">
          <h1 className="mb-3 text-xl font-bold text-red-600">
            Delete this group
          </h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} className="">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-500">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your group and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600"
                  onClick={() => {
                    deleteGroupGenerator.mutate(
                      { id: props.groupId },
                      {
                        onSuccess: () => {
                          router.push("/group");
                        },
                      }
                    );
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </Card>
  );
};

export default SettingPage;

export async function getStaticProps(
  context: GetStaticPropsContext<{ groupId: string }>
) {
  const helpers = generateSSGHelper();
  const groupId = context.params?.groupId as string;
  // prefetch `post.getAllGroupPosts`
  await helpers.group.getGroup.prefetch({ id: groupId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      groupId,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};
