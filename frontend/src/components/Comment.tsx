"use client";
import React, { useState } from "react";

const Comment: React.FC = () => {
  // Dummy data
  // const username = "John Doe";
  // const profilePhoto = "https://via.placeholder.com/40";
  // const timestamp = "2 hours ago";
  const commentText = "Comment:";

  const [replyText, setReplyText] = useState("");

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reply submission logic here
    console.log("Reply submitted:", replyText);
    setReplyText(""); // Clear the reply text area after submission
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-md">
      {/*<div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img
            src={profilePhoto}
            alt={`${username}'s profile`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="font-semibold">{username}</div>
        </div>
        <div className="text-gray-500 text-sm">{timestamp}</div>
      </div>*/}
      <div className="text-gray-800 dark:text-gray-200 mb-2">{commentText}</div>
      <form onSubmit={handleReplySubmit} className="flex flex-col">
        <textarea
          value={replyText}
          onChange={handleReplyChange}
          placeholder="Write a reply..."
          className="border border-gray-300 rounded-md p-2 mb-2 resize-none"
          rows={3}
        />
        <button
          type="submit"
          className="self-end bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Reply
        </button>
      </form>
    </div>
  );
};

export default Comment;
