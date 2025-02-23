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
import { useLikeComment } from "@/hooks/roles/comments/useLikeComments";
import { useCreateComment } from "@/hooks/roles/comments/useCreateComment";
import { useGetComments } from "@/hooks/roles/comments/useFetchComments";
import { EditDeleteComment } from "./editdeletecomment";
import { useDeleteComment } from "@/hooks/roles/comments/useDeleteComment";
import { useEditComment } from "@/hooks/roles/comments/useEditComment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUnlikeComment } from "@/hooks/roles/comments/useUnlikeComment";
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
  const { data: comments = [], isLoading, isError } = useGetComments(postId);
  const { mutate: createComment } = useCreateComment(postId);
  const { mutate: likeComment } = useLikeComment(postId);
  const { mutate: unlikeComment } = useUnlikeComment(postId);
  const { mutate: editComment } = useEditComment();
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // Track which comment is being edited
  const [editedContent, setEditedContent] = useState(""); // Track edited content
  const pic = useStore.getState().profilePicture;
  const name = useStore.getState().name;

  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  // Update localComments when comments data changes
  useEffect(() => {
    if (comments.length > 0) {
      const sortedComments = [...comments].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setLocalComments(sortedComments);
    }
  }, [comments]);

  // Handle comment submission
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const userId = useStore.getState().id;
    const username = useStore.getState().name;
    const profilePicture = useStore.getState().profilePicture;

    createComment(
      { content: data.comment, userId },
      {
        onSuccess: (newComment) => {
          setLocalComments((prevComments) => [
            {
              id: newComment.id,
              content: newComment.content,
              userId,
              blogId: postId,
              likeCount: 0,
              createdAt: new Date().toISOString(),
              username,
              profilePicture,
            },
            ...prevComments,
          ]);
          form.reset();
          setIsExpanded(false);
          setReplyingTo(null);
        },
      }
    );
  };

  // Handle comment deletion
  const { mutate: deleteComment } = useDeleteComment();

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId, {
      onSuccess: () => {
        // Remove the deleted comment from localComments
        setLocalComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      },
    });
  };

  const handleLikeToggle = (commentId: number) => {
    if (likedComments.has(commentId)) {
      // Unlike the comment
      unlikeComment(commentId.toString(), {
        onSuccess: () => {
          setLikedComments((prev) => {
            const newSet = new Set(prev);
            newSet.delete(commentId);
            return newSet;
          });
        },
      });
    } else {
      // Like the comment
      likeComment(commentId.toString(), {
        onSuccess: () => {
          setLikedComments((prev) => new Set(prev).add(commentId));
        },
      });
    }
  };

  // Handle comment editing
  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId); // Set the comment being edited
    setEditedContent(content); // Set the initial content for editing
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null); // Cancel editing
    setEditedContent(""); // Clear edited content
  };

  const handleSaveEdit = (commentId: number) => {
    editComment(
      { commentId, content: editedContent },
      {
        onSuccess: () => {
          // Update the localComments state with the edited content
          setLocalComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? { ...comment, content: editedContent }
                : comment
            )
          );
          setEditingCommentId(null); // Stop editing
          setEditedContent(""); // Clear edited content
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    setIsExpanded(false);
    setReplyingTo(null);
  };

  const handleReply = (username: string) => {
    setReplyingTo(username);
    form.setValue("comment", `@${username} `);
    setIsExpanded(true);
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
    }
  };

  {
    /*
    const handleLike = (commentId: number) => {
    likeComment(commentId.toString(), {
      onSuccess: () => {
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
*/
  }
  if (isLoading) return <div>Loading comments...</div>;
  if (isError) return <div>Error fetching comments</div>;

  return (
    <ScrollArea style={{ height: `calc(100vh - 100px)` }}>
      <div className="w-ful py-4 border-t border-gray-300 pr-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                {isLoading || isError ? (
                  <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-full"></div>
                ) : null}
                {isLoading || isError ? null : (
                  <>
                    <AvatarImage src={pic} />
                    <AvatarFallback>
                      <FaUser className="w-6 h-6 text-gray-500" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
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

        <div className="mt-6 border-t border-gray-200">
          {localComments.map((comment: Comment) => (
            <div key={comment.id} className="p-4">
              <div className="flex items-center">
                <Image
                  src={comment.profilePicture || "/default-avatar.png"}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div className="flex w-full justify-between ">
                  <div>
                    <span className="font-semibold">{comment.username}</span>{" "}
                    <span className="text-xs text-gray-500 ">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}{" "}
                    </span>
                  </div>
                  <div className="right-0">
                    <EditDeleteComment
                      commentId={comment.id}
                      onDelete={() => handleDeleteComment(comment.id)} // Pass delete handler
                      onEdit={() =>
                        handleEditComment(comment.id, comment.content)
                      } // Pass edit handler
                    />
                  </div>
                </div>
              </div>
              {/* Comment content or text input for editing */}
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex space-x-4 mt-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border border-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSaveEdit(comment.id)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2">{comment.content}</p>
                  <div className="flex space-x-4 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleLikeToggle(comment.id)}
                      className="border border-transparent"
                    >
                      <ThumbsUpIcon filled={likedComments.has(comment.id)} /> (
                      {comment.likeCount})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReply(comment.username)}
                    >
                      Reply
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
