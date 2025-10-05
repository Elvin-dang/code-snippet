import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="container py-8 mx-auto max-w-5xl">
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
};

export default NotFound;
