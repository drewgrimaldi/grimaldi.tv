import { useQuery } from '@tanstack/react-query';
import { studioSupabase } from '@/lib/studioSupabaseClient';
import { motion } from 'framer-motion';
import { Calendar, Newspaper, Rss } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import EmailGate from '../components/episodes/EmailGate';

export default function Blog() {
  const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem('dgp_subscriber_email'));
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ['studio-blog-posts'],
    queryFn: async () => {
      const { data, error } = await studioSupabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!unlocked) return <EmailGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }}
      />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-primary" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Blog</h1>
          </div>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS Feed</span>
          </a>
        </div>
        <p className="text-muted-foreground text-lg mb-12">Commentary and analysis from Drew Grimaldi</p>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 animate-pulse">
                <div className="aspect-video bg-secondary rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-secondary rounded" />
                  <div className="h-3 w-full bg-secondary rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground py-20">Couldn't load blog posts right now — try again shortly.</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No posts published yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/Blog/${post.slug}`}
                  className="block text-left bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  {post.thumbnail_url && (
                    <div className="aspect-video overflow-hidden bg-secondary">
                      <img src={post.thumbnail_url} alt={post.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category && (
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">{post.category}</span>
                    )}
                    <h3 className="font-bold text-foreground text-base leading-snug mt-1 line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.excerpt}</p>}
                    {post.published_date && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-3">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(post.published_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
