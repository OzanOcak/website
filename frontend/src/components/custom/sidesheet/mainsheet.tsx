"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import {
  Sheet,
  //SheetClose,
  SheetContent,
  SheetDescription,
  //SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageSquareText } from "lucide-react";
import { CommentSection } from "./comment";
import { useGetCommentCount } from "@/hooks/roles/comments/useFetchCommentCount";
import { useQueryClient } from "@tanstack/react-query";

export function SheetSide({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<"right" | "bottom">("right"); // State for the side
  //const [username, setUsername] = useState("@peduarte");
  const [isCommentAdded, setIsCommentAdded] = useState(false); // Track new comments
  const queryClient = useQueryClient();

  const {
    data: commentCountData,
    // isLoading,
    // isError,
  } = useGetCommentCount(slug);

  // Callback to update isCommentAdded
  const onCommentAdded = () => {
    setIsCommentAdded(true); // Set to true when a new comment is added
  };

  // Function to check screen width and update the side
  const updateSide = () => {
    if (window.innerWidth < 640) {
      setSide("bottom"); // Set side to "bottom" for small screens
    } else {
      setSide("right"); // Set side to "right" for larger screens
    }
  };

  // Add a resize event listener to update the side
  useEffect(() => {
    updateSide(); // Set initial side
    window.addEventListener("resize", updateSide); // Update side on resize
    return () => window.removeEventListener("resize", updateSide); // Cleanup
  }, []);

  return (
    <div className="">
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2 px-3 py-[1.26rem]  rounded-full text-gray-700 hover:text-gray-800
      dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 hover:dark:bg-gray-800 border-none"
      >
        <MessageSquareText />
        {commentCountData?.count > 0 ? (
          <span className="font-md">{commentCountData.count}</span> // Display comment count
        ) : (
          <span className="font-md">0</span>
        )}
      </Button>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            console.log("Sheet closed. Invalidating query...");
            console.log(isCommentAdded);
            if (isCommentAdded) {
              queryClient.invalidateQueries({
                queryKey: ["blogpost", slug, "commentcount"],
              });
            }
            setIsOpen(false); // Close the sheet
            setIsCommentAdded(false); // Reset the flag
          } else {
            setIsOpen(true); // Open the sheet
          }
        }}
      >
        <SheetContent
          side={side}
          className={side === "bottom" ? "h-[70%] overflow-y-auto" : ""}
        >
          <SheetHeader>
            <SheetTitle>Responses:</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="">
            <CommentSection
              postId={slug}
              onCommentAdded={onCommentAdded}
              side={side}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
