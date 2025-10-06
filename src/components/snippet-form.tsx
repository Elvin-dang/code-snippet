"use client";

import React, { useMemo } from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeComplexity, type ComplexityAnalysis } from "@/lib/complexity-analyzer";
import { ComplexityBadge } from "@/components/complexity-badge";
import { Loader2 } from "lucide-react";
import z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Spinner } from "./ui/spinner";
import { languages } from "@/lib/utils";

const getFormSchema = (dict: any) =>
  z.object({
    title: z.string().min(2, dict.newSnippet.fields.title.error).max(100),
    description: z.string().max(1000, dict.newSnippet.fields.description.error),
    code: z.string().min(1, dict.newSnippet.fields.code.error),
    language: z.string().min(1, dict.newSnippet.fields.language.error),
    tags: z.string().optional(),
  });

export function SnippetForm({ dict }: { dict: any }) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ComplexityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const formSchema = useMemo(() => getFormSchema(dict), [dict]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      language: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (form.getValues("code").trim().length > 10) {
      setIsAnalyzing(true);

      const timer = setTimeout(() => {
        const result = analyzeComplexity(form.getValues("code"), dict);
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
    }
  }, [form.watch("code"), dict]);

  async function onSubmit({
    title,
    description,
    code,
    language,
    tags,
  }: z.infer<typeof formSchema>) {
    setLoading(true);
    const filteredTags = tags
      ?.split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          code,
          language,
          tags: filteredTags,
          complexity: analysis?.complexity,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Snippet created successfully!", {
          duration: 4000,
          position: "top-center",
        });
        router.push(`/snippets/${data.id}`);
      } else {
        toast.warning("Failed to create snippet", {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{dict.newSnippet.fields.title.label}</FormLabel>
              <FormControl>
                <Input placeholder={dict.newSnippet.fields.title.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{dict.newSnippet.fields.description.label}</FormLabel>
              <FormControl>
                <Textarea placeholder={dict.newSnippet.fields.description.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{dict.newSnippet.fields.language.label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={dict.newSnippet.fields.language.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.slug} value={lang.slug}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{dict.newSnippet.fields.code.label}</FormLabel>
              <FormControl>
                <Textarea placeholder={dict.newSnippet.fields.code.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(analysis || isAnalyzing) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {dict.complexity.title}
                {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
              <CardDescription>{dict.complexity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis && <ComplexityBadge analysis={analysis} showDetails dict={dict} />}
            </CardContent>
          </Card>
        )}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{dict.newSnippet.fields.tags.label}</FormLabel>
              <FormControl>
                <Input placeholder={dict.newSnippet.fields.tags.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dict.newSnippet.fields.tags.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {dict.newSnippet.actions.submit}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            {dict.newSnippet.actions.cancel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
