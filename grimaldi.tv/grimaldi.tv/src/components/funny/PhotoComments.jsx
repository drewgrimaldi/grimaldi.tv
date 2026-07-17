import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function PhotoComments({ photoId }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  const { data: comments = [] } = useQuery({
    queryKey: ['photo-comments', photoId],
    queryFn: () => base44.entities.PhotoComment.filter({ photo_id: photoId }, '-created_date', 100),
    enabled: open,
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.PhotoComment.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['photo-comments', photoId] }); setComment(''); setName(''); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PhotoComment.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['photo-comments', photoId] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addMutation.mutate({ photo_id: photoId, name: name || 'Anonymous', comment });
  };

  return (
    <div className="border-t border-border/50 bg-card/50">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <MessageCircle className="w-3.5 h-3.5" />{open ? 'Hide comments' : 'Leave a comment'}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-3">
          {comments.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{c.name}: </span>
                    <span className="text-muted-foreground">{c.comment}</span>
                    <p className="text-muted-foreground/60 text-[10px] mt-0.5">{formatDistanceToNow(new Date(c.created_date), { addSuffix: true })}</p>
                  </div>
                  {isAdmin && <button onClick={() => deleteMutation.mutate(c.id)} className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>}
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} className="h-7 text-xs bg-secondary border-border/50" />
            <Textarea placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} className="text-xs bg-secondary border-border/50 resize-none h-16" required />
            <Button type="submit" size="sm" disabled={!comment.trim() || addMutation.isPending} className="w-full h-7 text-xs rounded-full">
              {addMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
