import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

function getCloudflareEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('/iframe')) return url;
  const parts = url.split('/manifest/');
  if (parts.length > 1) return parts[0] + '/iframe';
  return url;
}

export default function PastStreams() {
  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ['past-streams'],
    queryFn: () => base44.entities.Episode.list('-publish_date'),
  });

  const streamed = episodes.filter(ep => ep.cloudflare_url);
  if (!isLoading && streamed.length === 0) return null;

  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
          Past Streams
        </motion.h2>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 animate-pulse">
                <div className="aspect-video bg-secondary rounded-t-2xl" />
                <div className="p-4 space-y-2"><div className="h-4 w-3/4 bg-secondary rounded" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streamed.map((ep, i) => (
              <motion.div key={ep.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className="aspect-video">
                  <iframe src={getCloudflareEmbedUrl(ep.cloudflare_url)} title={ep.title} frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2">{ep.title}</h3>
                  {ep.guest && <p className="text-sm text-primary/80 mt-1">with {ep.guest}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
