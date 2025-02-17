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
import { useForgotPassword } from "@/hooks/forgotten-password/useForgotPassword";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailFormInputs = z.infer<typeof emailSchema>;

const EmailForm: React.FC = () => {
  const forgotPasswordMutation = useForgotPassword(); // Hook to handle forgot password API
  const { status } = forgotPasswordMutation;
  const form = useForm<EmailFormInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // State to hold error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: EmailFormInputs) => {
    setErrorMessage(null); // Clear any previous error
    setSuccessMessage(null);
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setSuccessMessage(
        "If this email is registered, you will receive a password reset link."
      );
    } catch (error) {
      // Handle error from the API
      if (error instanceof Error) {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p> // Display error message in red
        )}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p> // Display success message in green
        )}
        <EmailFormField
          name="email" // Only email field
          label="Email"
          placeholder="Email"
          description="Please enter a valid email address."
          inputType="email" // Set input type to email
          formControl={form.control}
        />
        <Button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
};

type EmailFormFieldProps = {
  name: FieldPath<EmailFormInputs>;
  label: string;
  placeholder: string;
  description: string;
  inputType: string;
  formControl: Control<EmailFormInputs>;
};

const EmailFormField: React.FC<EmailFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailForm;
