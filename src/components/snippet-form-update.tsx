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
    title: z.string().min(2, "Title needs at least 2 characters").max(100),
    description: z.string().max(1000, "Description can be up to 1000 characters"),
    code: z.string().min(1, "Code is required"),
    language: z.string().min(1, "Language is required"),
    tags: z.string().optional(),
  });

export function SnippetFormUpdate({ dict, snippet }: { dict: any; snippet: any }) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<ComplexityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const formSchema = useMemo(() => getFormSchema(dict), [dict]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: snippet?.title || "",
      description: snippet?.description || "",
      code: snippet?.code || "",
      language: snippet?.language.slug || "",
      tags: snippet?.tags.join(", ") || "",
    },
  });

  useEffect(() => {
    if (form.getValues("code").trim().length > 10) {
      setIsAnalyzing(true);

      const timer = setTimeout(() => {
        const result = analyzeComplexity(form.getValues("code"));
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
    }
  }, [form.watch("code")]);

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
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: "PATCH",
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
        toast.success("Snippet updated successfully!", {
          duration: 4000,
          position: "top-center",
        });
        router.push(`/snippets/${data.id}`);
      } else {
        toast.warning("Failed to update snippet", {
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Quick sort implementation" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of what this code does..." {...field} />
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
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
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
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Textarea placeholder="// Your code here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(analysis || isAnalyzing) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                Time Complexity Analysis
                {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
              <CardDescription>Automatic estimation based on code patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis && <ComplexityBadge analysis={analysis} showDetails />}
            </CardContent>
          </Card>
        )}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="algorithm, sorting, recursion" {...field} />
              </FormControl>
              <FormDescription>Separate tags with commas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />}
            Update Snippet
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
