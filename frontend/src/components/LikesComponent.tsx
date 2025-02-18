"use client";
import { useDislike } from "@/hooks/roles/useDislike";
import { useGetLikes } from "@/hooks/roles/useGetLikes";
import { useLike } from "@/hooks/roles/useLike";
import React from "react";
import { ThumbsUpIcon } from "./icons/ThumbsUpIcon";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/stores/useAuthStore";

interface LikeDislikeButtonsProps {
  postId: string;
}

const LikeDislikeButtons: React.FC<LikeDislikeButtonsProps> = ({ postId }) => {
  const { data, isLoading, isError } = useGetLikes(postId);
  const { mutate: likePost, isPending: isLiking } = useLike();
  const { mutate: dislikePost, isPending: isDisliking } = useDislike();
  const queryClient = useQueryClient();

  // Access Zustand store properties separately
  //const likedBlogs = useStore((state) => state.likedBlogs); // Access the likedBlogs state
  const likeBlog = useStore((state) => state.likeBlog); // Access the likeBlog action
  const unlikeBlog = useStore((state) => state.unlikeBlog); // Access the unlikeBlog action
  const isBlogLiked = useStore((state) => state.isBlogLiked); // Access the isBlogLiked function

  const handleLike = () => {
    if (isBlogLiked(postId)) {
      // If already liked, unlike the post
      unlikeBlog(postId);
      dislikePost(postId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["blogpost", postId, "likes"],
          });
        },
        onError: (error) => {
          console.error("Error disliking post:", error);
        },
      });
    } else {
      // If not liked, like the post
      likeBlog(postId);
      likePost(postId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["blogpost", postId, "likes"],
          });
        },
        onError: (error) => {
          console.error("Error liking post:", error);
        },
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching likes</div>;

  return (
    <div className="flex items-center gap-4">
      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={isLiking || isDisliking}
        className={`flex items-center gap-2 p-2 rounded-full ${
          isBlogLiked(postId)
            ? "bg-blue-100 text-blue-500 dark:bg-gray-800 dark:text-blue-300"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-100"
        } hover:bg-blue-100 transition-colors`}
      >
        <ThumbsUpIcon filled={isBlogLiked(postId)} />
        <span>{data?.likes || 0}</span>
      </button>
    </div>
  );
};

export default LikeDislikeButtons;
