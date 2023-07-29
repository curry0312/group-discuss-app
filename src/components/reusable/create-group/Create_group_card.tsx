import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1,"Group name is required"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const Create_group_card = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create new group</CardTitle>
        <CardDescription className="text-md">
          Make a new group to chat with friends
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Label id="create_group">Name</Label>
          <Input
            {...register("name")}
            id="create_group"
            className="w-full"
            placeholder="Name of your group"
          />
          {errors.name && (
            <span className="mt-2 block text-xs text-red-800">
              {errors.name?.message}
            </span>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button variant="secondary" type="submit">
            Create group
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Create_group_card;
