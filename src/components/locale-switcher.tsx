"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { defaultLocale, detectLocale, locales } from "@/lib/utils";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export function LocaleSwitcher({ dict }: { dict: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useMemo(() => detectLocale(pathname, locales, defaultLocale), [pathname]);

  const setLocale = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={locale === loc ? "bg-accent" : ""}
          >
            {dict.language[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
