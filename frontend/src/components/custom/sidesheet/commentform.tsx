import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import Image from "next/image";
import { useStore } from "@/stores/useAuthStore";
import { useCreateComment } from "@/hooks/roles/comments/useCreateComment";

const FormSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment cannot be empty." })
    .max(300, { message: "Comment must not be longer than 300 characters." }),
});

interface CommentFormProps {
  postId: string;
  replyingTo: string | null; // Prop to hold the username being replied to
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  replyingTo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pic = useStore.getState().profilePicture;
  const name = useStore.getState().name;
  const { mutate: createComment } = useCreateComment(postId);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: replyingTo ? `@${replyingTo} ` : "", // Pre-fill with @username
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const userId = useStore.getState().id;

    createComment(
      { content: data.comment, userId },
      {
        onSuccess: () => {
          form.reset();
          setIsExpanded(false);
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    setIsExpanded(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start space-x-3">
          <Image
            src={pic}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <span className="font-semibold">{name}</span>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What are your thoughts?"
                      className={`resize-none transition-all ${
                        isExpanded ? "h-32" : "h-10"
                      }`}
                      onFocus={() => setIsExpanded(true)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        )}
      </form>
    </Form>
  );
};
