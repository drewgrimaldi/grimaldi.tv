import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhotoComments from '@/components/funny/PhotoComments';

export default function PhotoDetail() {
  const { id } = useParams();

  const { data: photo, isLoading } = useQuery({
    queryKey: ['funny-photo', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('funny_photos').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: photo?.title || 'Funny Photo', url });
      } catch {
        // user cancelled the share sheet — no action needed
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen py-24 px-6" />;
  }

  if (!photo) {
    return (
      <div className="min-h-screen py-24 px-6 text-center">
        <p className="text-muted-foreground text-lg mb-4">Photo not found.</p>
        <Link to="/FunnyPhotos" className="text-primary hover:underline">Back to Photo Gallery</Link>
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

      <div className="max-w-xl mx-auto">
        <Link to="/FunnyPhotos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Photo Gallery
        </Link>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <img src={photo.image_url} alt={photo.title || 'Funny photo'} className="w-full max-h-[70vh] object-contain bg-black" />
          <div className="p-5 flex items-start justify-between gap-4">
            <div>
              {photo.title && <h1 className="font-bold text-foreground text-lg">{photo.title}</h1>}
              {photo.caption && <p className="text-muted-foreground text-sm mt-1">{photo.caption}</p>}
            </div>
            <Button size="sm" variant="outline" onClick={handleShare} className="gap-1.5 rounded-full shrink-0">
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
          </div>
          <PhotoComments photoId={photo.id} />
        </div>
      </div>
    </div>
  );
}
