import { Code2 } from "lucide-react";

export default async function LoginPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Code2 className="size-4" />
            CodeSnippet
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/saly.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
