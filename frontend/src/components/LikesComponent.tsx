"use client";
import { useDislike } from "@/hooks/roles/useDislike";
import { useGetLikes } from "@/hooks/roles/useGetLikes";
import { useLike } from "@/hooks/roles/useLike";
import React from "react";
import { ThumbsUpIcon } from "./icons/ThumbsUpIcon";
import { ThumbsDownIcon } from "./icons/ThumbsDownIcon";
import { useQueryClient } from "@tanstack/react-query";

interface LikeDislikeButtonsProps {
  postId: string;
}

const LikeDislikeButtons: React.FC<LikeDislikeButtonsProps> = ({ postId }) => {
  const { data, isLoading, isError } = useGetLikes(postId);
  const { mutate: likePost, isPending: isLiking } = useLike();
  const { mutate: dislikePost, isPending: isDisliking } = useDislike();
  const queryClient = useQueryClient();

  // State to track if the post is liked or disliked
  const [hasLiked, setHasLiked] = React.useState(false);
  const [hasDisliked, setHasDisliked] = React.useState(false);

  // Handle like/dislike toggle
  const handleLike = () => {
    if (hasLiked) {
      // If already liked, dislike the post
      dislikePost(postId, {
        onSuccess: () => {
          setHasLiked(false); // Remove like
          setHasDisliked(false); // Remove dislike
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
      likePost(postId, {
        onSuccess: () => {
          setHasLiked(true); // Set like
          setHasDisliked(false); // Remove dislike
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

  // Handle dislike/like toggle
  const handleDislike = () => {
    if (hasDisliked) {
      // If already disliked, like the post
      likePost(postId, {
        onSuccess: () => {
          setHasDisliked(false); // Remove dislike
          setHasLiked(false); // Remove like
          queryClient.invalidateQueries({
            queryKey: ["blogpost", postId, "likes"],
          });
        },
        onError: (error) => {
          console.error("Error liking post:", error);
        },
      });
    } else {
      // If not disliked, dislike the post
      dislikePost(postId, {
        onSuccess: () => {
          setHasDisliked(true); // Set dislike
          setHasLiked(false); // Remove like
          queryClient.invalidateQueries({
            queryKey: ["blogpost", postId, "likes"],
          });
        },
        onError: (error) => {
          console.error("Error disliking post:", error);
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
          hasLiked
            ? "bg-blue-100 text-blue-500 dark:bg-gray-800 dark:text-blue-300"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-100"
        } hover:bg-blue-100 transition-colors`}
      >
        <ThumbsUpIcon filled={hasLiked} />
        <span>{data?.likes || 0}</span>
      </button>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        disabled={isLiking || isDisliking}
        className={`flex items-center gap-2 p-2 rounded-full ${
          hasDisliked
            ? "bg-red-100 text-red-500 dark:bg-gray-800 dark:text-red-300"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-100"
        } hover:bg-red-100 transition-colors`}
      >
        <ThumbsDownIcon filled={hasDisliked} />
      </button>
    </div>
  );
};

export default LikeDislikeButtons;
