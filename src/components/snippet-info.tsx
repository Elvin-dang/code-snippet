"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, User, Calendar, Clock, Share } from "lucide-react";
import { analyzeComplexity } from "@/lib/complexity-analyzer";
import { ComplexityBadge } from "@/components/complexity-badge";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SnippetInfo({ dict, lang }: { dict: any; lang: string }) {
  const router = useRouter();
  const [snippet, setSnippet] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const user = session?.user;
  const isAuthor = user?.id === snippet?.userId;
  const analysis = snippet && dict ? analyzeComplexity(snippet.code, dict) : null;

  useEffect(() => {
    async function fetchSnippet() {
      setFetching(true);
      try {
        const response = await fetch(`/api/snippets/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSnippet(data);
        } else {
          setSnippet(null);
        }
      } catch (error) {
        setSnippet(null);
      } finally {
        setFetching(false);
      }
    }
    if (id) fetchSnippet();
  }, [id]);

  if (fetching) {
    return (
      <div className="container py-8 max-w-5xl mx-auto space-y-6 animate-pulse p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-8 w-3/5 rounded" />
            <Skeleton className="h-4 w-2/5 rounded" />
          </div>
          <div className="flex gap-2 shrink-0">
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-4/5 rounded" />
            <Skeleton className="h-6 w-3/5 rounded" />
            <Skeleton className="h-6 w-2/5 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="container py-8 mx-auto max-w-5xl p-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Snippet not found</p>
            <Button asChild className="mt-4">
              <Link href="/snippets">Back to Snippets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/snippets/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Copied 🎉", {
      position: "top-center",
      duration: 2000,
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Snippet deleted successfully!", {
          duration: 4000,
          position: "top-center",
        });
        router.push("/");
      } else {
        toast.warning("Failed to delete snippet", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(lang, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto p-4">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4">
          <div className="flex justify-between flex-1 w-full">
            <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Share className="h-4 w-4 md:mr-2" />
                <span className="md:block hidden">{dict.snippet.share}</span>
              </Button>
              {isAuthor && (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/snippets/${id}/edit`}>
                      <Edit className="h-4 w-4 md:mr-2" />
                      <span className="md:block hidden">{dict.snippet.edit}</span>
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        {deleting ? <Spinner /> : <Trash2 className="h-4 w-4 md:mr-2" />}
                        <span className="md:block hidden">{dict.snippet.delete}</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{dict.snippet.confirmDeleteTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {dict.snippet.confirmDeleteMessage}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{dict.snippet.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          {dict.snippet.confirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{snippet.description}</p>
        </div>

        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={snippet.user.image} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Link href={`/profile/${snippet.userId}`} className="hover:text-primary">
                  {snippet.user.username}
                </Link>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(snippet.updatedAt)}</span>
              </div>
              {(snippet.complexity || analysis) && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{dict.snippet.complexity}:</span>
                    {snippet.complexity ? (
                      <Badge variant="outline">{snippet.complexity}</Badge>
                    ) : (
                      analysis && <ComplexityBadge analysis={analysis} />
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">{snippet.language.name}</Badge>
              {snippet?.tags.map((tag: any) => (
                <Link key={tag.id} href={`/tags/${encodeURIComponent(tag.slug)}`}>
                  <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <CodeBlock code={snippet.code} language={snippet.language.name} />

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dict.complexity.title}</CardTitle>
              <CardDescription>{dict.complexity.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplexityBadge analysis={analysis} showDetails dict={dict} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
