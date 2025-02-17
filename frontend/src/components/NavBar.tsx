"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { ModeSwitch } from "./ThemeToggle";
import { ProfileMenu } from "./custom/profileMenu";
import { SignIn } from "./custom/signinButton";
import { useStore } from "@/stores/useAuthStore";
import { Button } from "./ui/button";

const NavBar = () => {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // const path = useStore((state) => state.lastPath);
  const accessToken = useStore((state) => state.accessToken);
  // const role = useStore((state) => state.role);

  // This runs whenever page changes to some other page
  useEffect(() => {
    setProgress(30);

    setTimeout(() => {
      setProgress(70);
    }, 100);

    setTimeout(() => {
      setProgress(100);
    }, 800);
  }, [pathname]);

  // This runs whenever page loads
  useEffect(() => {
    setTimeout(() => {
      setProgress(0);
    }, 900);
  }, []);

  // Memoize the navigation links
  const navigationLinks = useMemo(
    () => (
      <nav className="flex items-center space-x-4 ">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/apps"}>Apps</Link>
        </li>
        <li>
          <Link href={"/blog"}>Blog</Link>
        </li>
      </nav>
    ),
    []
  );

  return (
    <nav className="h-16 bg-background/50 sticky top-0 border-b px-8 backdrop-blur flex items-center justify-between z-10">
      <LoadingBar
        color="#0ef05b"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className=" font-extrabold text-xl">
        <Link href={"/"}>o.O</Link>
      </div>
      <ModeSwitch />

      <ul className="hidden sm:flex w-full justify-end items-center space-x-4 mr-2">
        <div className="flex items-center gap-4">
          {navigationLinks}
          {
            <div className="">
              {accessToken ? <ProfileMenu /> : null}
              {accessToken ? null : <SignIn />}
            </div>
          }
        </div>
        {/* <li className="buttons px-4 space-x-2">
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "outline" })}
          >
            Sign Up
          </Link>
        </li>*/}
      </ul>

      <div className="flex items-center justify-center sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="absolute text-lg font-extrabold top-1 right-3 p-5"
                >
                  X
                </Button>
              </SheetClose>
            </SheetHeader>
            <MobileNav />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default NavBar;

// npm install -- force react-top-loading-bar
