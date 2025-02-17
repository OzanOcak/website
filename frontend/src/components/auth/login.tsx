import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  /*FormMessage,*/
} from "../ui/form";
import { Button } from "../ui/button";
import Link from "next/link";
import { Control, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useLogin } from "@/hooks/auth/useLogin";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(3, "Email is required")
    .max(50),
  password: z.string().min(6, "Password must be at least 6 characters long"),
}); // for security reasons, feedback is not required

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin(setErrorMessage);
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMessage(null);

    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-600 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {/* Email Field */}
        <LoginFormField
          name="email"
          label="Email"
          placeholder="Enter your email"
          inputType="email"
          formControl={form.control}
        />

        {/* Password Field */}
        <LoginFormField
          name="password"
          label="Password"
          placeholder="Enter your password"
          inputType="password"
          formControl={form.control}
        />

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-400"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>

          <Button
            asChild
            type="button"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-colors duration-200 dark:bg-green-500 dark:hover:bg-green-400"
          >
            <Link href="/signup" className="text-white dark:text-white">
              Create a new account
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

type LoginFormFieldProps = {
  name: keyof LoginFormInputs; // Use keyof for better type safety
  label: string;
  placeholder: string;
  // description: string;
  inputType: string;
  formControl: Control<LoginFormInputs>;
};

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  name,
  label,
  placeholder,
  //description,
  inputType,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field /*, fieldState*/ }) => (
        <FormItem>
          <FormLabel className="text-gray-800 dark:text-gray-400">
            {label}
          </FormLabel>
          {/*over write the text color so it will not change when requirement not provided, no clue was given*/}
          <FormControl>
            <Input
              className="border border-gray-800 dark:border-gray-600"
              placeholder={placeholder}
              type={inputType}
              {...field}
            />
          </FormControl>
          {/*description && <FormDescription>{description}</FormDescription>*/}
          {/*fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )*/}
          {/* Display error message */}
        </FormItem>
      )}
    />
  );
};

export default LoginForm;
