import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import Image from "next/image";
import { useStore } from "@/stores/useAuthStore";
import { ThumbsUpIcon } from "./icons/ThumbsUpIcon";

const FormSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: "Comment cannot be empty.",
    })
    .max(300, {
      message: "Comment must not be longer than 300 characters.",
    }),
});

interface Comment {
  id: number;
  comment: string;
  username: string; // Add username to the Comment interface
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // Track the user being replied to
  const pic = useStore.getState().profilePicture;
  const name = useStore.getState().name;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setComments([
      ...comments,
      { id: Date.now(), comment: data.comment, username: name }, // Include the username
    ]);
    form.reset();
    setIsExpanded(false);
    setReplyingTo(null); // Clear the reply state after submission
  };

  const handleCancel = () => {
    form.reset();
    setIsExpanded(false);
    setReplyingTo(null); // Clear the reply state on cancel
  };

  const handleReply = (username: string) => {
    setReplyingTo(username); // Set the user being replied to
    form.setValue("comment", `@${username} `); // Pre-fill the text area with @username
    setIsExpanded(true); // Expand the text area
    const textarea = document.querySelector("textarea"); // Focus the text area
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <div className="w-full p-4 border-t border-gray-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Image
              src={pic} // User's profile picture
              alt="User Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <span className="font-semibold">{name}</span> {/* User's name */}
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

      {/* Comments List */}
      <div className="mt-6 border-t border-gray-200">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 ">
            <div className="flex items-center">
              <Image
                src={pic} // User's profile picture
                alt="User Avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span className="font-semibold">{comment.username}</span>
            </div>
            <p className="mt-2">{comment.comment}</p>
            <div className="flex space-x-4 mt-2">
              <Button
                variant="outline"
                onClick={() => alert("Liked!")}
                className="border border-transparent"
              >
                <ThumbsUpIcon filled={true} />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleReply(comment.username)} // Handle reply
              >
                Reply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
