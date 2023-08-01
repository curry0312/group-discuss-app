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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Switch } from "src/components/ui/switch";
import { useToast } from "src/components/ui/use-toast";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import Line from "../seperate-item/Line";
import Image from "next/image";
import { useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";

// You need to import our styles for the button to look right. Best to import in the root /_app.tsx but this is fine
import "@uploadthing/react/styles.css";
import { UploadButton } from "~/utils/uploadthing";
import { useCreateGroupStore } from "~/store/useCreateGroupStore";

const formSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  public: z.boolean(),
  image: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Create_group_card = () => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      public: false,
      image: "",
    },
  });
  const { toast } = useToast();
  const groupCreateGenerator = api.group.createGroup.useMutation();

  const [previewImage, setPreviewImage] = useState<any>("https://github.com/shadcn.png");

  const { onClose } = useCreateGroupStore();

  const ctx = api.useContext();

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
    groupCreateGenerator.mutate(
      { ...data, image: previewImage },
      {
        onSuccess: (newGroup) => {
          console.log(newGroup);
          form.reset();
          toast({
            description: "Group created successfully!",
          });
          ctx.group.getAllGroups.invalidate(); //refresh the rendering post section
          onClose()
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-extrabold">
          Create a new group
        </CardTitle>
        <CardDescription className="text-sm">
          Make a new group to chat with friends
        </CardDescription>
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
                    <Input placeholder="Enter the group name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Line />
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
            <Line />
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
                              previewImage || "https://github.com/shadcn.png"
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="destructive" onClick={()=>onClose()}>Cancel</Button>
            <Button
              variant="outline"
              type="submit"
              disabled={groupCreateGenerator.isLoading}
              onClick={() => {
                toast({
                  description: "Creating...",
                });
              }}
            >
              {!!groupCreateGenerator.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create group
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Create_group_card;