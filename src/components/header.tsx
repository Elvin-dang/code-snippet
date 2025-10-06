"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Code2, User, LogOut, Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUser } from "./providers/user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header({ dict }: { dict: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-2 gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Code2 className="h-6 w-6 text-primary" />
          <span>CodeSnippet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/snippets"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {dict.nav.explore}
          </Link>
          <Link href="/tags" className="text-sm font-medium hover:text-primary transition-colors">
            {dict.nav.tags}
          </Link>

          <LocaleSwitcher dict={dict} />

          {loading ? (
            <div className="h-9 w-20 animate-pulse bg-muted rounded" />
          ) : user ? (
            <>
              <Button asChild size="sm" className="gap-2">
                <Link href="/snippets/new">
                  <Plus className="h-4 w-4" />
                  {dict.nav.newSnippet}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>{dict.nav.myProfile}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {dict.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{dict.nav.login}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">{dict.nav.signup}</Link>
              </Button>
            </>
          )}
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" closeButton={false} className="w-[300px] gap-0 md:hidden">
            <SheetHeader className="p-4 px-3">
              <SheetTitle className="flex items-center gap-2 justify-between">
                {loading ? (
                  <div className="h-9 w-20 animate-pulse bg-muted rounded" />
                ) : user ? (
                  <>
                    {user.username}
                    <LocaleSwitcher dict={dict} />
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/login">{dict.nav.login}</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/signup">{dict.nav.signup}</Link>
                    </Button>
                  </>
                )}
              </SheetTitle>
            </SheetHeader>
            <Separator />
            <nav className="flex flex-col items-start">
              <Link
                href="/snippets"
                className="text-sm font-medium hover:text-primary transition-colors p-2 hover:bg-accent w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.nav.explore}
              </Link>
              <Link
                href="/tags"
                className="text-sm font-medium hover:text-primary transition-colors p-2 hover:bg-accent w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dict.nav.tags}
              </Link>

              {loading ? (
                <div className="h-9 w-20 animate-pulse bg-muted rounded" />
              ) : (
                user && (
                  <>
                    <Separator />
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="gap-2 w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/snippets/new">
                        <Plus className="h-4 w-4" />
                        {dict.nav.newSnippet}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="gap-2 w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href={`/profile/${user.id}`}>
                        <User className="h-4 w-4" />
                        {dict.nav.myProfile}
                      </Link>
                    </Button>
                    <Separator />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 w-full justify-start text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {dict.nav.logout}
                    </Button>
                  </>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
