import { useState, useEffect } from "react";
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

import { formatDistanceToNow } from "date-fns"; // Import the date-fns function
import { ThumbsUpIcon } from "../../icons/ThumbsUpIcon";
import { useStore } from "@/stores/useAuthStore";
import { useLikeComment } from "@/hooks/roles/comments/usLikeComments";
import { useCreateComment } from "@/hooks/roles/comments/useCreateComment";
import { useGetComments } from "@/hooks/roles/comments/useFetchComments";
import { EditDeleteComment } from "./editdeletecomment";
//import { ElipsisVertical } from "./icons/ElipsisVertical";

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
  content: string;
  userId: number;
  blogId: string;
  likeCount: number;
  createdAt: string; // Ensure this is a string in ISO format
  username: string;
  profilePicture: string;
}

export function CommentSection({ postId }: { postId: string }) {
  const { data: comments = [], isLoading, isError } = useGetComments(postId); // Fetch comments with a default value
  const { mutate: createComment } = useCreateComment(postId); // Create comment mutation
  const { mutate: likeComment } = useLikeComment(postId); // Like comment mutation
  const [localComments, setLocalComments] = useState<Comment[]>([]); // Local state for comments
  const [isExpanded, setIsExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // Track the user being replied to
  const pic = useStore.getState().profilePicture;
  const name = useStore.getState().name;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "", // Initialize the comment field as empty
    },
  });

  // Update localComments when comments data changes
  useEffect(() => {
    if (comments.length > 0) {
      // Sort comments by createdAt in descending order
      const sortedComments = [...comments].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setLocalComments(sortedComments);
    }
  }, [comments]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const userId = useStore.getState().id;
    const username = useStore.getState().name;
    const profilePicture = useStore.getState().profilePicture;

    // Use the createComment mutation to submit the comment
    createComment(
      { content: data.comment, userId },
      {
        onSuccess: (newComment) => {
          // Add the new comment to the local state with the user's data
          setLocalComments((prevComments) => [
            {
              id: newComment.id,
              content: newComment.content,
              userId,
              blogId: postId,
              likeCount: 0, // Default like count
              createdAt: new Date().toISOString(), // Current timestamp
              username,
              profilePicture,
            },
            ...prevComments, // Add the new comment at the top
          ]);
          form.reset(); // Reset the form after submission
          setIsExpanded(false);
          setReplyingTo(null); // Clear the reply state after submission
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset(); // Reset the form (clears the text area)
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

  const handleLike = (commentId: number) => {
    likeComment(commentId.toString(), {
      onSuccess: () => {
        // Update the likeCount for the specific comment without reordering
        setLocalComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, likeCount: comment.likeCount + 1 }
              : comment
          )
        );
      },
    });
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (isError) return <div>Error fetching comments</div>;

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
        {localComments.map((comment: Comment) => (
          <div key={comment.id} className="p-4">
            <div className="flex items-center">
              <Image
                src={comment.profilePicture || "/default-avatar.png"} // Use the commenter's profile picture
                alt="User Avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="flex w-full justify-between ">
                <div>
                  <span className="font-semibold">{comment.username}</span>{" "}
                  {/* Username */}
                  <span className="text-xs text-gray-500 ">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}{" "}
                    {/* Time elapsed */}
                  </span>
                </div>
                <div className="right-0">
                  <EditDeleteComment commentId={comment.id} />
                </div>
              </div>
            </div>
            <p className="mt-2">{comment.content}</p> {/* Comment content */}
            <div className="flex space-x-4 mt-2">
              <Button
                variant="outline"
                onClick={() => handleLike(comment.id)} // Handle like
                className="border border-transparent"
              >
                <ThumbsUpIcon filled={true} /> ({comment.likeCount})
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
