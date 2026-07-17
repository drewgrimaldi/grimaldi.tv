import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import EpisodeCard from '../components/home/EpisodeCard';
import EmailGate from '../components/episodes/EmailGate';
import FeaturedPodcasts from '../components/episodes/FeaturedPodcasts';
import AdminEpisodeForm from '../components/episodes/AdminEpisodeForm';
import { useAuth } from '@/lib/AuthContext';

export default function Episodes() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem('dgp_subscriber_email'));

  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ['episodes-all-v2'],
    queryFn: () => base44.entities.Episode.list('-publish_date', 1000),
  });

  const sorted = [...episodes].sort((a, b) => {
    const dateA = a.publish_date ? new Date(a.publish_date.substring(0, 10)) : new Date(0);
    const dateB = b.publish_date ? new Date(b.publish_date.substring(0, 10)) : new Date(0);
    return dateB - dateA;
  });

  if (!unlocked) return <EmailGate onUnlock={() => setUnlocked(true)} />;

  const filtered = sorted.filter((ep) => {
    const q = search.toLowerCase();
    return ep.title?.toLowerCase().includes(q) || ep.guest?.toLowerCase().includes(q) || ep.description?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen py-8 px-6 relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }} />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 bg-red-600/20 border border-red-600/40 rounded-2xl p-2 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <p className="text-white font-semibold text-xs">Watch LIVE every Saturday at 11AM EST</p>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <a href="https://www.youtube.com/@thedrewgrimaldipodcast" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-full text-xs transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube
            </a>
            <a href="https://rumble.com/DrewGrimaldi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-green-700 hover:bg-green-800 text-white font-semibold px-3 py-1 rounded-full text-xs transition-colors">
              <img src="https://media.base44.com/images/public/69b6b824807a75fd2d45c448/ab6d13c0e_image.png" alt="Rumble" className="w-3.5 h-3.5" /> Rumble
            </a>
          </div>
        </div>
        <div><FeaturedPodcasts /></div>
        <div className="flex items-center justify-between mb-6 mt-6 flex-wrap gap-3">
          <h2 className="font-display text-2xl font-bold text-foreground">All Podcasts</h2>
          {isAdmin && (
            <Button onClick={() => setShowAddForm(true)} className="rounded-full gap-2 bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4" /> Add Episode
            </Button>
          )}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search episodes, guests, topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border/50 rounded-full h-11" />
        </motion.div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 animate-pulse">
                  <div className="aspect-video bg-secondary" />
                  <div className="p-5 space-y-3"><div className="h-3 w-20 bg-secondary rounded" /><div className="h-5 w-3/4 bg-secondary rounded" /><div className="h-3 w-full bg-secondary rounded" /></div>
                </div>
              ))
            : filtered.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
        </div>
        {!isLoading && filtered.length === 0 && (
          <div className="mt-20 text-center"><p className="text-muted-foreground text-lg">{episodes.length === 0 ? 'No episodes yet — stay tuned!' : 'No episodes match your search.'}</p></div>
        )}
      </div>

      {showAddForm && (
        <AdminEpisodeForm
          onClose={(saved) => {
            setShowAddForm(false);
            if (saved) queryClient.invalidateQueries({ queryKey: ['episodes-all-v2'] });
          }}
        />
      )}
    </div>
  );
}
