import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

export function SnippetCard({ snippet, dict, lang }: { snippet: any; dict: any; lang: string }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(lang, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/snippets/${snippet.id}`}>
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{snippet.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{snippet.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {snippet.language.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((tag: any) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
          {snippet.complexity && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {dict.snippetCard.complexity}: {snippet.complexity}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{snippet.user.username}</span>
          </div>
          <span>•</span>
          <span>{formatDate(snippet.createdAt)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
