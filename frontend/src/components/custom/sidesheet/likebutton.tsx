import { ThumbsUpIcon } from "@/components/icons/ThumbsUpIcon";
import { Button } from "@/components/ui/button";
import { useLikeComment } from "@/hooks/roles/comments/useLikeComments";
import { useUnlikeComment } from "@/hooks/roles/comments/useUnlikeComment";

const LikeButton = ({
  commentId,
  postId,
  likeCount,
  likedByUser,
}: {
  commentId: number;
  postId: string;
  likeCount: number;
  likedByUser: boolean;
}) => {
  const likeCommentMutation = useLikeComment(postId);
  const unlikeCommentMutation = useUnlikeComment(postId);

  const handleLike = () => {
    if (likedByUser) {
      // Unlike the comment if already liked
      unlikeCommentMutation.mutate(commentId.toString());
    } else {
      // Like the comment if not already liked
      likeCommentMutation.mutate(commentId.toString());
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLike}
      className={`border border-transparent ${
        likedByUser ? "bg-blue-500 text-white" : ""
      }`}
      disabled={
        likeCommentMutation.isPending || unlikeCommentMutation.isPending
      }
    >
      <ThumbsUpIcon filled={likedByUser} /> ({likeCount})
    </Button>
  );
};

export default LikeButton;
