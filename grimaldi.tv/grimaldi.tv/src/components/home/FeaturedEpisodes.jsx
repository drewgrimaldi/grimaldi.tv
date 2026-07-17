import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import EpisodeCard from './EpisodeCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedEpisodes() {
  const { data: allEpisodes = [], isLoading } = useQuery({
    queryKey: ['episodes-featured'],
    queryFn: () => base44.entities.Episode.list('-publish_date', 20),
  });

  const episodes = [...allEpisodes]
    .sort((a, b) => {
      const dateA = a.publish_date ? new Date(a.publish_date.substring(0, 10)) : new Date(0);
      const dateB = b.publish_date ? new Date(b.publish_date.substring(0, 10)) : new Date(0);
      return dateB - dateA;
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 animate-pulse">
                <div className="aspect-video bg-secondary" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-secondary rounded" />
                  <div className="h-5 w-3/4 bg-secondary rounded" />
                  <div className="h-3 w-full bg-secondary rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (episodes.length === 0) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Latest Episodes</h2>
            <p className="mt-2 text-muted-foreground">Catch up on the newest conversations</p>
          </div>
          <Link to="/Episodes" className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} />)}
        </div>
        <Link to="/Episodes" className="mt-8 flex sm:hidden items-center justify-center gap-2 text-sm font-medium text-primary">
          View All Episodes <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
