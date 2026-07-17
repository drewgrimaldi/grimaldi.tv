import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Image, Plus, X, Upload, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import EmailGate from '../components/episodes/EmailGate';
import { Link } from 'react-router-dom';

export default function FunnyPhotos() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem('dgp_subscriber_email'));
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['funny-photos'],
    queryFn: () => base44.entities.FunnyPhoto.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FunnyPhoto.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['funny-photos'] }); setShowForm(false); setTitle(''); setCaption(''); setFile(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FunnyPhoto.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['funny-photos'] }),
  });

  if (!unlocked) return <EmailGate onUnlock={() => setUnlocked(true)} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await createMutation.mutateAsync({ title, caption, image_url: file_url, publish_date: new Date().toISOString().split('T')[0] });
    setUploading(false);
  };

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }} />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-3">
            <Image className="w-6 h-6 text-primary" />
            <div><h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Photo Gallery</h1><p className="mt-1 text-muted-foreground text-lg">A collection of laughs</p></div>
          </div>
          {isAdmin && <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2 bg-primary hover:bg-primary/90 rounded-full px-8 text-base font-bold shadow-lg shadow-primary/30"><Plus className="w-5 h-5" /> Add Photo</Button>}
        </div>
        {isAdmin && showForm && (
          <div className="mb-10 bg-card border border-border/50 rounded-2xl p-6 max-w-lg">
            <h2 className="font-semibold text-foreground mb-4">Upload Funny Photo</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input placeholder="Title (optional)" value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary border-border/50" />
              <Input placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} className="bg-secondary border-border/50" />
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{file ? file.name : 'Click to choose image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} required />
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={!file || uploading} className="flex-1 rounded-full">{uploading ? 'Uploading...' : 'Upload'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-full">Cancel</Button>
              </div>
            </form>
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-card rounded-xl border border-border/50 animate-pulse aspect-square" />)}
          </div>
        ) : photos.length === 0 ? (
          <p className="text-center text-muted-foreground py-20 text-lg">No funny photos yet — check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 aspect-square flex flex-col">
                <Link to={`/FunnyPhotos/${photo.id}`} className="flex-1 flex items-center justify-center bg-secondary overflow-hidden">
                  <img src={photo.image_url} alt={photo.title || 'Funny photo'} className="w-full h-full object-contain" />
                </Link>
                {(photo.title || photo.caption) && (
                  <div className="p-3 bg-card/80 backdrop-blur-sm border-t border-border/50">
                    {photo.title && <p className="text-sm font-semibold text-foreground line-clamp-1">{photo.title}</p>}
                    {photo.caption && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{photo.caption}</p>}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/FunnyPhotos/${photo.id}`;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: photo.title || 'Funny Photo', url });
                        } catch {
                          // user cancelled the share sheet
                        }
                      } else {
                        await navigator.clipboard.writeText(url);
                        alert('Link copied!');
                      }
                    }}
                    className="bg-black/60 rounded-full p-1 text-white hover:bg-primary"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                  {isAdmin && <button onClick={() => deleteMutation.mutate(photo.id)} className="bg-black/60 rounded-full p-1 text-white hover:bg-red-600"><X className="w-3 h-3" /></button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
