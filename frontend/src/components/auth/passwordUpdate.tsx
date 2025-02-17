"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUpdateUserPassword } from "@/hooks/forgotten-password/useUpdatePassword";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

const passwordValidation = (data: {
  newPassword: string;
  confirmPassword: string;
}) => {
  if (data.newPassword !== data.confirmPassword) {
    return { confirmPassword: "Passwords do not match" };
  }
  return {};
};

type PasswordFormInputs = z.infer<typeof passwordSchema>;

const PasswordUpdateForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mutation = useUpdateUserPassword();
  const userId = localStorage.getItem("userId") as string; // Retrieve userId from local storage

  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access query parameters
  const otps = searchParams.get("otps"); // Get the `otps` query parameter

  // Check for otps in query parameters and redirect if not present
  useEffect(() => {
    if (otps !== "true") {
      router.push("/verify-otp"); // Redirect if otps is not present or not true
    }
  }, [otps, router]);

  const form = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormInputs) => {
    setErrorMessage(null);

    const validationErrors = passwordValidation(data);
    if (Object.keys(validationErrors).length > 0) {
      form.setError("confirmPassword", {
        message: validationErrors.confirmPassword,
      });
      return;
    }

    // Convert otps to a boolean value, if not equal is gonna be false
    const otpsBoolean = otps === "true"; // the problem is otps iis gotton via url query (string)

    // Call the mutation with userId and newPassword
    mutation.mutate(
      {
        userId: userId,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        otps: otpsBoolean,
      },
      {
        onError: (error: Error) => {
          setErrorMessage(error.message); // Handle error
        },
        onSuccess: () => {
          setErrorMessage("Password updated successfully!");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {errorMessage && (
          <div
            className={`${
              errorMessage.includes("successfully")
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            } px-4 py-3 rounded-md text-sm`}
          >
            {errorMessage}
          </div>
        )}

        {/* New Password Field */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your new password"
                  type="password"
                  {...field}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>At least 6 characters.</FormDescription>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm your new password"
                  type="password"
                  {...field}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>Must match the new password.</FormDescription>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </Button>

          <Button
            asChild
            type="button"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
          >
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PasswordUpdateForm;
