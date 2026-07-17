import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studioSupabase } from '@/lib/studioSupabaseClient';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import EmailGate from '../components/episodes/EmailGate';

export default function BlogPost() {
  const { slug } = useParams();
  const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem('dgp_subscriber_email'));

  const { data: posts = [], isLoading } = useQuery({
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

  const post = posts.find((p) => p.slug === slug);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
      } catch {
        // user cancelled the share sheet — no action needed
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  if (!unlocked) return <EmailGate onUnlock={() => setUnlocked(true)} />;

  if (isLoading) {
    return <div className="min-h-screen py-24 px-6" />;
  }

  if (!post) {
    return (
      <div className="min-h-screen py-24 px-6 text-center">
        <p className="text-muted-foreground text-lg mb-4">Post not found — it may have been unpublished.</p>
        <Link to="/Blog" className="text-primary hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }}
      />
      <div className="fixed inset-0 bg-background/70 backdrop-blur-md -z-10" />

      <div className="max-w-2xl mx-auto">
        <Link to="/Blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {post.thumbnail_url && (
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-64 object-cover" />
          )}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
              {post.category && (
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                  {post.category}
                </span>
              )}
              <Button size="sm" variant="outline" onClick={handleShare} className="gap-1.5 rounded-full">
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3">{post.title}</h1>
            {post.published_date && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-6">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.published_date), 'MMMM d, yyyy')}</span>
              </div>
            )}
            <div
              className="prose prose-invert max-w-none text-foreground/90 leading-relaxed [&_h2]:text-foreground [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-2 [&_a]:text-primary [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
