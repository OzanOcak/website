"use client";
import React, { useState } from "react";
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
import { useForgotPassword } from "@/hooks/forgotten-password/useForgotPassword";
import Link from "next/link";

// Define the schema for the email input
const emailSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

// Infer types from the schema
type EmailFormInputs = z.infer<typeof emailSchema>;

const PasswordRequestForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sendVerificationEmailMutation = useForgotPassword();

  const form = useForm<EmailFormInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormInputs) => {
    setErrorMessage(null);

    // Call the mutation to send the verification email
    sendVerificationEmailMutation.mutate(
      { email: data.email },
      {
        onError: (error: Error) => {
          setErrorMessage(error.message); // Handle error
        },
        onSuccess: () => {
          setErrorMessage("Verification link sent to your email!"); // Handle success
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        {/* Error Message */}
        {errorMessage && (
          <div
            className={`${
              errorMessage.includes("sent")
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            } px-4 py-3 rounded-md text-sm`}
          >
            {errorMessage}
          </div>
        )}

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  {...field}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormDescription>
                We will send a verification link to this email.
              </FormDescription>
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
            disabled={sendVerificationEmailMutation.isPending}
          >
            {sendVerificationEmailMutation.isPending
              ? "Sending..."
              : "Send Verification Link"}
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

export default PasswordRequestForm;
