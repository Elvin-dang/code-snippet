"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Spinner } from "./ui/spinner";

const getFormSchema = (dict: any) =>
  z.object({
    email: z.email({ message: dict.login.fields.email.error }),
    password: z.string().min(6, { message: dict.login.fields.password.error }).max(100),
  });

export function LoginForm({
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
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (response?.ok) {
        router.push(callbackUrl || "/");
      } else {
        toast.error(response?.error, {
          duration: 4000,
          position: "top-center",
        });
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
            <h1 className="text-2xl font-bold">{dict.login.title}</h1>
            <p className="text-muted-foreground text-xs text-balance">{dict.login.description}</p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.login.fields.email.label}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.login.fields.email.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.login.fields.password.label}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={dict.login.fields.password.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Field>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner />}
              {dict.login.actions.submit}
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              {dict.login.actions.dontHaveAccount}{" "}
              <a
                href={`${
                  callbackUrl ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signup"
                }`}
                className="underline underline-offset-4"
              >
                {dict.login.actions.signup}
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
