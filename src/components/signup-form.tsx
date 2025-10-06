"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

const getFormSchema = (dict: any) =>
  z
    .object({
      username: z.string().min(2, { message: dict.signup.fields.name.error }).max(100),
      email: z.email({ message: dict.signup.fields.email.error }),
      password: z.string().min(6, { message: dict.signup.fields.password.error }).max(100),
      confirmPassword: z
        .string()
        .min(6, { message: dict.signup.fields.confirmPassword.error })
        .max(100),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.signup.fields.confirmPassword.errorUnmatched,
      path: ["confirmPassword"],
    });

export function SignupForm({
  className,
  dict,
  callbackUrl,
  ...props
}: React.ComponentProps<"form"> & { dict: any; callbackUrl?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formSchema = useMemo(() => getFormSchema(dict), [dict]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ username, email, password }: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(dict.signup.common.success, {
          duration: 4000,
          position: "top-center",
        });
        router.push(callbackUrl ? `/login?callbackUrl=${callbackUrl}` : "/login");
      } else {
        toast.warning(dict.signup.common.error[data.error_code], {
          duration: 4000,
          position: "top-center",
        });
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">{dict.signup.title}</h1>
            <p className="text-muted-foreground text-xs text-balance">{dict.signup.description}</p>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.signup.fields.name.label}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.signup.fields.name.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.signup.fields.email.label}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.signup.fields.email.placeholder} {...field} />
                </FormControl>
                <FormDescription>{dict.signup.fields.email.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.signup.fields.password.label}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>{dict.signup.fields.password.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.signup.fields.confirmPassword.label}</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {dict.signup.actions.submit}
          </Button>
          <Field>
            <FieldDescription className="px-6 text-center">
              {dict.signup.actions.haveAccount}{" "}
              <a
                href={`${
                  callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"
                }`}
              >
                {dict.signup.actions.login}
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
