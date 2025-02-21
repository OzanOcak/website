"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ElipsisVertical } from "../../icons/ElipsisVertical";

interface EditDeleteCommentProps {
  commentId: number;
  onDelete: () => void; // Define onDelete as a function
  onEdit: () => void; // Add onEdit prop
}

export const EditDeleteComment: React.FC<EditDeleteCommentProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  commentId,
  onDelete,
  onEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = useCallback(() => {
    onDelete(); // Call the onDelete function passed from CommentSection
    setIsOpen(false); // Close the dropdown after deletion
  }, [onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(); // Call the onEdit function
    setIsOpen(false); // Close the dropdown
  }, [onEdit]);

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
      className="relative flex items-center justify-center bg-gray-800/0 dark:bg-gray-900/0"
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
              onClick={handleEdit}
            >
              Edit
            </div>

            <div className="border-t border-gray-600"></div>
            <div
              className="px-4 py-2 text-gray-200 hover:bg-gray-600 cursor-pointer"
              onClick={handleDelete} // Call handleDelete on click
            >
              Delete
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
