import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

export default function AdminEpisodeForm({ onClose }) {
  const [form, setForm] = useState({
    title: '',
    episode_number: '',
    guest: '',
    description: '',
    publish_date: '',
    duration: '',
    youtube_url: '',
    rumble_url: '',
    spotify_url: '',
    apple_url: '',
    tags: '',
    featured: false,
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        episode_number: form.episode_number ? Number(form.episode_number) : null,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };
      await base44.entities.Episode.create(payload);
      onClose(true); // true = "saved, please refresh the list"
    } catch (err) {
      console.error('Failed to save episode:', err);
      alert('Something went wrong saving the episode. Check the console for details.');
    } finally {
      setSaving(false);
    }
  };

  const textField = (key, label, placeholder, required = false) => (
    <div>
      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">
        {label}
      </label>
      <input
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h3 className="font-bold text-foreground text-lg">Add Episode</h3>
          <button onClick={() => onClose(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4 overflow-y-auto">
          {textField('title', 'Episode Title', 'THE DREW GRIMALDI PODCAST - 7/4/2026', true)}
          {textField('episode_number', 'Episode Number (optional)', 'e.g. 42')}
          {textField('guest', 'Guest (optional)', 'e.g. Mike Lindell')}

          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={5}
              placeholder="What's this episode about..."
              className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">
                Publish Date
              </label>
              <input
                type="date"
                value={form.publish_date}
                onChange={set('publish_date')}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {textField('duration', 'Duration', 'e.g. 47:10')}
          </div>

          {textField('youtube_url', 'YouTube Link', 'https://www.youtube.com/watch?v=...')}
          {textField('rumble_url', 'Rumble Link', 'https://rumble.com/...')}
          {textField('spotify_url', 'Spotify Link (optional)', 'https://open.spotify.com/...')}
          {textField('apple_url', 'Apple Podcasts Link (optional)', 'https://podcasts.apple.com/...')}
          {textField('tags', 'Tags (optional, comma-separated)', 'e.g. Election Integrity, Iran')}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 accent-red-600"
            />
            <span className="text-sm text-foreground">Feature this episode on the homepage/top row</span>
          </label>

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-card">
            <Button type="button" variant="outline" onClick={() => onClose(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !form.title} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Episode'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
