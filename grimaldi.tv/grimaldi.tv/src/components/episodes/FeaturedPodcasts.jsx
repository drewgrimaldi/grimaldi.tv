import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EpisodeCard from '../home/EpisodeCard';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

function ManageFeaturedModal({ episodes, featured, onClose, onToggle }) {
  const allEpisodes = [...episodes].sort((a, b) => {
    const da = a.publish_date ? new Date(a.publish_date.substring(0, 10)) : new Date(0);
    const db = b.publish_date ? new Date(b.publish_date.substring(0, 10)) : new Date(0);
    return db - da;
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-bold text-foreground text-lg">Manage Featured Podcasts</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{featured.length}/5 slots filled — check up to 5 episodes</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-1">
          {allEpisodes.map(ep => {
            const isFeatured = !!ep.featured;
            const disabled = !isFeatured && featured.length >= 5;
            return (
              <label key={ep.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary/50'}`}>
                <input type="checkbox" checked={isFeatured} disabled={disabled} onChange={() => onToggle(ep, !isFeatured)} className="w-4 h-4 accent-red-600 shrink-0" />
                <span className="text-sm text-foreground line-clamp-1">{ep.title}</span>
                {isFeatured && <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0 ml-auto" />}
              </label>
            );
          })}
        </div>
        <div className="p-4 border-t border-border"><Button onClick={onClose} className="w-full rounded-full">Done</Button></div>
      </div>
    </div>
  );
}

export default function FeaturedPodcasts() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ['episodes-all-v2'],
    queryFn: () => base44.entities.Episode.list('-publish_date', 1000),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, featured }) => base44.entities.Episode.update(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['episodes-all-v2'] }),
  });

  const featured = episodes.filter(ep => ep.featured).slice(0, 5);

  const handleToggle = (ep, val) => {
    if (val && featured.length >= 5) return;
    updateMutation.mutate({ id: ep.id, featured: val });
  };

  if (isLoading) return null;
  if (featured.length === 0 && !isAdmin) return null;

  return (
    <>
      {showModal && <ManageFeaturedModal episodes={episodes} featured={featured} onClose={() => setShowModal(false)} onToggle={handleToggle} />}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2"><Star className="w-5 h-5 text-primary fill-primary" /> Top Featured Interviews</h2>
          {isAdmin && <Button size="sm" variant="outline" onClick={() => setShowModal(true)} className="gap-2 rounded-full"><Settings className="w-4 h-4" /> Edit Featured</Button>}
        </div>
        {featured.length === 0 ? (
          <div className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Star className="w-8 h-8" /><p className="text-sm">No featured episodes yet. Click "Edit Featured" to add some.</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featured.map((ep, i) => (
              <div key={ep.id} className="snap-start shrink-0 w-[50vw] sm:w-[32vw] lg:w-[20vw]"><EpisodeCard episode={ep} index={i} /></div>
            ))}
          </div>
        )}
        <hr className="border-border/50 mt-10" />
      </div>
    </>
  );
}
