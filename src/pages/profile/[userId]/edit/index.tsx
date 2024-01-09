import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// You need to import our styles for the button to look right. Best to import in the root /_app.tsx but this is fine
import "@uploadthing/react/styles.css";
import { UploadButton } from "~/utils/uploadthing";
import { toast } from "~/components/ui/use-toast";
import { useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import Image from "next/image";
import { api } from "~/utils/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import generateSSRHelper from "~/utils/generateSSRHelper";
import { useRouter } from "next/router";

const formSchema = z.object({
  username: z.string().min(1, { message: "Name is required" }),
  bio: z.string(),
  image: z.string(),
});

export default function EditProfilePage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data: userData } = api.user.getUser.useQuery({ id: props.userId });
  const updateUserGenerator = api.user.updateUser.useMutation();
  const [previewImage, setPreviewImage] = useState(userData?.image);
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userData?.name,
      bio: userData?.bio,
      image: previewImage,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    updateUserGenerator.mutate(
      { ...values, image: previewImage! },
      {
        onSuccess: (updatedUser) => {
          toast({
            description: "Profile updated successfully!",
          });
          console.log(updatedUser);
        },
      }
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full h-screen rounded-none border-none sm:w-[350px] sm:h-fit sm:rounded-md sm:border-gray-200">
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>Once you finish, press save button</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-center">
                <div className="w-[200px] rounded-full">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={previewImage!}
                      alt="group-image"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-full object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  console.log("Files: ", res);
                  toast({
                    description: "Image uploaded successfully!",
                  });
                  if (res) {
                    if (res[0]?.fileUrl) setPreviewImage(res[0]?.fileUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
              <FormMessage />
              <div className="flex justify-between items-center">
                <Button variant="outline" className="" onClick={() => {router.back()}}>
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ userId: string }>
) {
  const helpers = generateSSRHelper();
  const userId = context.params?.userId as string;
  if (typeof userId !== "string") throw new Error("no userId");
  // prefetch `user.getUser`
  await helpers.user.getUser.prefetch({ id: userId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      userId,
    },
  };
}
