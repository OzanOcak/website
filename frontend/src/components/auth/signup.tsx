"use client";
import React, { useState } from "react";
import { Control, FieldPath, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios, { AxiosError } from "axios";
import { useSignup } from "@/hooks/auth/useSignup";

const signupSchema = z.object({
  username: z.string().min(3, "Username is required").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const signupMutation = useSignup();
  const { status } = signupMutation;
  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur", // live feedback
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // State to hold error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: SignupFormInputs) => {
    setErrorMessage(null); // Clear any previous error
    setSuccessMessage(null);
    try {
      await signupMutation.mutateAsync(data);
      setSuccessMessage(
        "Registration successful! Please check your email to verify your account."
      );
      //navigate("/info"); // Navigate after successful signup
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status;
        if (statusCode === 400) {
          setErrorMessage(
            "Unable to create an account. Please check your details. If you forgot your password, you can reset it."
          );
        } else if (statusCode === 409) {
          setErrorMessage("Username is already taken.");
        } else {
          setErrorMessage(
            axiosError.message || "An error occurred. Please try again."
          );
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-400  px-4 py-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-400 px-4 py-3 rounded-md text-sm">
            {successMessage}
          </div>
        )}
        <SignupFormField
          name="username"
          label="Username"
          placeholder="Username"
          description="At least 3 characters."
          inputType="text"
          formControl={form.control}
          // error={form.formState.errors.username}
        />
        <SignupFormField
          name="email" // Add email field
          label="Email"
          placeholder="Email"
          description="Please enter a valid email address."
          inputType="email" // Set input type to email
          formControl={form.control}
          // error={form.formState.errors.email}
        />
        <SignupFormField
          name="password"
          label="Password"
          placeholder="Password"
          description="At least 6 characters."
          inputType="password"
          formControl={form.control}
          // error={form.formState.errors.password}
        />
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
          type="submit"
          disabled={status === "pending"}
        >
          {status === "pending" ? "Signing Up..." : "Signup"}
        </Button>
      </form>
    </Form>
  );
};

type SignupFormFieldProps = {
  name: FieldPath<SignupFormInputs>;
  label: string;
  placeholder: string;
  description: string;
  inputType: string;
  formControl: Control<SignupFormInputs>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignupFormField: React.FC<SignupFormFieldProps & { error?: any }> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
  /*error,*/
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {/*error && <p className="text-red-500 text-sm">{error.message}</p>*/}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SignupForm;
