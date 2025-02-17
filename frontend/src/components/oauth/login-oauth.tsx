import React, { useState } from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOauthLogin } from "@/hooks/oauth/useOathLogin";

const loginSchema = z.object({
  username: z.string().min(4, "Username is required").max(50),
});

type LoginFormInputs = { username: string };

export const LoginOauthForm: React.FC<{
  profileName: string;
}> = ({ profileName }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useOauthLogin(setErrorMessage);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: profileName, // Set the default value for the username field
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {/* Username Field */}
        <LoginFormField
          name="username"
          label="Username"
          placeholder={profileName || "Enter your username"}
          inputType="text"
          formControl={form.control}
        />

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

type LoginFormFieldProps = {
  name: keyof LoginFormInputs;
  label: string;
  placeholder: string;
  inputType: string;
  formControl: Control<LoginFormInputs>;
};

const LoginFormField: React.FC<LoginFormFieldProps> = ({
  name,
  label,
  placeholder,
  inputType,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={inputType} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
