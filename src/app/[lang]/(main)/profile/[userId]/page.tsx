"use client";

import { useEffect, useRef, useState } from "react";
import { SnippetCard } from "@/components/snippet-card";
import { Card, CardContent } from "@/components/ui/card";
import { User, Calendar, Code2, Pencil, Camera } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { SnippetCardSkeleton } from "@/components/snippet-card-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/components/providers/user-provider";
import { nanoid } from "nanoid";
import { storage } from "@/lib/appwrite";
import { toast } from "sonner";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const { user: self, setUser: setSelf } = useUser();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [fetchingSnippets, setFetchingSnippets] = useState(true);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [renderPaginationBar, setRenderPaginationBar] = useState(false);
  const [open, setOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const limit = 6;

  useEffect(() => {
    const fetchSnippets = async () => {
      setFetchingSnippets(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await fetch(`/api/snippets?userId=${userId}&${params.toString()}`);
      const data = await response.json();

      setSnippets(data.snippets);
      setTotalPages(data.totalPages);
      setFetchingSnippets(false);
      setRenderPaginationBar(data.totalPages > 1);
    };

    fetchSnippets();
  }, [userId, page]);

  useEffect(() => {
    const fetchUser = async () => {
      setFetchingUser(true);
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setNewUsername(data.username);
      } else {
        setUser(null);
      }
      setFetchingUser(false);
    };

    fetchUser();
  }, [userId]);

  if (!user && !fetchingUser) {
    return (
      <div className="container py-8 mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">User not found</h2>
            <p className="text-muted-foreground mb-4">
              This user doesn't exist or hasn't shared any snippets yet.
            </p>
            <Button asChild>
              <Link href="/snippets">Browse Snippets</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleSavingUsername = async () => {
    if (!newUsername || newUsername === user.username) return;
    setSaving(true);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setSelf(data);
      setOpen(false);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const suffix = nanoid(10);
    const fileId = `${userId}-${suffix}`;

    const promise = storage.createFile({
      bucketId: "avatar",
      fileId,
      file,
    });

    const uploadPromise = (async () => {
      setUploadingAvatar(true);
      try {
        const newFile = await promise;
        const fileUrl = storage.getFileView({
          bucketId: "avatar",
          fileId: newFile.$id,
        });

        const res = await fetch(`/api/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: fileUrl }),
        });

        if (!res.ok) throw new Error("Failed to update user");
        const data = await res.json();

        setUser(data);
        setSelf(data);
        return "Avatar uploaded successfully";
      } catch (err) {
        console.error("Upload failed:", err);
        throw err;
      } finally {
        setUploadingAvatar(false);
        avatarRef.current!.value = "";
      }
    })();

    toast.promise(uploadPromise, {
      loading: "Uploading...",
      success: (msg) => msg,
      error: "Failed to upload avatar",
      position: "top-center",
    });
  };

  return (
    <div className="container py-8 mx-auto p-4">
      <div className="space-y-8">
        {fetchingUser ? (
          <Card>
            <CardContent>
              <div className="flex items-start gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 min-w-0 space-y-3">
                  <Skeleton className="h-8 w-40 rounded-md" />
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="relative h-20 w-20 rounded-full shrink-0">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="User avatar"
                      className="h-20 w-20 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  )}

                  {userId === self?.id && (
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => avatarRef.current?.click()}
                    >
                      <Camera className="h-6 w-6 text-white opacity-50" />
                      <input
                        className="sr-only"
                        type="file"
                        id="avatarUpload"
                        accept="image/*"
                        disabled={uploadingAvatar}
                        ref={avatarRef}
                        onChange={handleAvatarUpload}
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                    {userId === self?.id && (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit name</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <Input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              placeholder="Enter new name"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="secondary"
                              onClick={() => setOpen(false)}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleSavingUsername} disabled={saving}>
                              {saving && <Spinner />} Save
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      <span>
                        {snippets.length} {snippets.length === 1 ? "snippet" : "snippets"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {renderPaginationBar && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((prev) => prev - 1);
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage((prev) => prev + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <div>
          {user && <h2 className="text-2xl font-bold mb-6">Snippets by {user.username}</h2>}
          {fetchingSnippets ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(limit)].map((_, i) => (
                <SnippetCardSkeleton key={i} />
              ))}
            </div>
          ) : snippets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No snippets yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
