"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast("🎉 Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-b-0">
        <span className="text-sm font-mono text-muted-foreground">{language}</span>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="relative overflow-x-auto bg-card border rounded-b-lg">
        <pre className="p-4">
          <code className="font-mono text-sm">
            {showLineNumbers ? (
              <div className="flex">
                <div
                  className="select-none text-muted-foreground pr-4 text-right"
                  style={{ minWidth: "3ch" }}
                >
                  {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1">{code}</div>
              </div>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
