'use client';

import { fetcher } from '@/lib/utils';
import { useState } from 'react';
import useSWR from 'swr';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/TextArea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'EVENT' | 'NEWS';
  eventDate: string | null;
  location: string | null;
  published: boolean;
  createdAt: string;
}

const emptyForm = {
  title: '',
  content: '',
  type: 'NEWS' as 'EVENT' | 'NEWS',
  eventDate: '',
  location: '',
  published: false,
};

export default function PostsManagement() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'EVENT' | 'NEWS'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const typeParam = typeFilter !== 'all' ? `&type=${typeFilter}` : '';
  const { data: posts, isLoading, mutate } = useSWR<Post[]>(
    `/api/posts?all=true${typeParam}`,
    fetcher
  );

  function openCreate() {
    setEditingPost(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(post: Post) {
    setEditingPost(post);
    setForm({
      title: post.title,
      content: post.content,
      type: post.type,
      eventDate: post.eventDate ? post.eventDate.slice(0, 16) : '',
      location: post.location || '',
      published: post.published,
    });
    setDialogOpen(true);
  }

  function openDelete(post: Post) {
    setDeletingPost(post);
    setDeleteDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title || !form.content || !form.type) {
      toast.error('Title, content, and type are required');
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: form.title,
        content: form.content,
        type: form.type,
        eventDate: form.type === 'EVENT' && form.eventDate ? form.eventDate : null,
        location: form.type === 'EVENT' ? form.location : null,
        published: form.published,
      };

      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || 'Failed to save post');
        return;
      }

      toast.success(editingPost ? 'Post updated' : 'Post created');
      setDialogOpen(false);
      mutate();
    } catch {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingPost) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${deletingPost.id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to delete post');
        return;
      }
      toast.success('Post deleted');
      setDeleteDialogOpen(false);
      setDeletingPost(null);
      mutate();
    } catch {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="NEWS">News</TabsTrigger>
            <TabsTrigger value="EVENT">Events</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4">Loading...</div>
      ) : !posts?.length ? (
        <div className="p-8 text-center text-gray-500">No posts yet. Create your first one!</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-congress-blue-100">
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${post.type === 'EVENT'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                    }`}>
                    {post.type === 'EVENT' ? 'Event' : 'News'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${post.published
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {post.type === 'EVENT' && post.eventDate ? (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(post.eventDate).toLocaleDateString()}
                    </span>
                  ) : (
                    new Date(post.createdAt).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(post)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openDelete(post)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'New Post'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the post details below.' : 'Fill in the details to create a new post.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Post title"
              />
            </div>

            <div>
              <Label htmlFor="post-type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'EVENT' | 'NEWS' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEWS">News</SelectItem>
                  <SelectItem value="EVENT">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={form.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your content here..."
                rows={5}
              />
            </div>

            {form.type === 'EVENT' && (
              <>
                <div>
                  <Label htmlFor="post-event-date" className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> Event Date
                  </Label>
                  <Input
                    id="post-event-date"
                    type="datetime-local"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="post-location" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </Label>
                  <Input
                    id="post-location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. School Hall"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <input
                id="post-published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="post-published">Publish immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingPost ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingPost?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
