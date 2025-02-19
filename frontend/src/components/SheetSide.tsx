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
import { CommentSection } from "./Comment2";

export function SheetSide() {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<"right" | "bottom">("right"); // State for the side
  //const [username, setUsername] = useState("@peduarte");

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
    <div className="grid grid-cols-2 gap-2">
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex items-center gap-2 px-6 py-[1.15rem] text-xl rounded-full text-black dark:text-white bg-gray-100 dark:bg-gray-800"
      >
        <MessageSquareText />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Responses:</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <CommentSection />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
