"use client";
import { useDeleteComment } from "@/hooks/roles/comments/useDeleteComment";
import { useCallback, useEffect, useRef, useState } from "react";
import { ElipsisVertical } from "../../icons/ElipsisVertical";

interface EditDeleteCommentProps {
  commentId: number; // Define commentId as a number
}

export const EditDeleteComment: React.FC<EditDeleteCommentProps> = ({
  commentId,
}) => {
  console.log("commentId: ", commentId);

  const { mutate: deleteMutate } = useDeleteComment(commentId);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown

  const handleDelete = useCallback(() => {
    deleteMutate(commentId);
    setIsOpen(false); // Close the dropdown after logout
  }, [deleteMutate, commentId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      className="relative  flex items-center justify-center bg-gray-800/0 dark:bg-gray-900/0"
      id="avatar"
    >
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ElipsisVertical />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef} // Attach the ref to the dropdown
          className="absolute right-[-3rem] mt-28 w-32 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50"
        >
          <div className="">
            <div
              className="px-4 py-2 text-gray-200 hover:bg-gray-600 cursor-pointer"
              onClick={() => console.log("edit")}
            >
              Edit
            </div>

            <div className="border-t border-gray-600"></div>
            <div
              className="px-4 py-2 text-gray-200 hover:bg-gray-600 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
