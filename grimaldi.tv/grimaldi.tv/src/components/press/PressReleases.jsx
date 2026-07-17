import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Plus, Loader2, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const MEDIA_KIT_URL = 'https://media.base44.com/files/public/69b6b824807a75fd2d45c448/30362b1d5_DrewGrimaldiPodcastMediaKit.pdf';

function PressReleaseModal({ release, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-foreground text-lg leading-snug pr-4">{release.headline}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto p-5">
          {release.publish_date && <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-4">{format(new Date(release.publish_date + 'T12:00:00'), 'MMMM d, yyyy')}</p>}
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{release.full_text || release.sub_headline || 'No additional content.'}</p>
        </div>
        <div className="p-5 border-t border-border"><Button onClick={onClose} className="w-full rounded-xl bg-red-600 hover:bg-red-700">Close</Button></div>
      </div>
    </div>
  );
}

function AdminPressForm({ onClose }) {
  const [form, setForm] = useState({ headline: '', sub_headline: '', full_text: '', publish_date: '' });
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.PressRelease.create(form);
    queryClient.invalidateQueries({ queryKey: ['press-releases'] });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-foreground text-lg">Add Press Release</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          {[
            { key: 'headline', label: 'Headline', placeholder: 'Official headline', required: true },
            { key: 'sub_headline', label: 'Sub-headline', placeholder: 'One-sentence summary' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} required={f.required}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">Full Text</label>
            <textarea value={form.full_text} onChange={e => setForm(p => ({ ...p, full_text: e.target.value }))} rows={5} placeholder="Full press release text..."
              className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">Publish Date</label>
            <input type="date" value={form.publish_date} onChange={e => setForm(p => ({ ...p, publish_date: e.target.value }))}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PressReleases() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [viewing, setViewing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data: releases = [], isLoading } = useQuery({
    queryKey: ['press-releases'],
    queryFn: () => base44.entities.PressRelease.list('-publish_date', 50),
  });

  return (
    <section className="py-16 px-6 border-t border-border/40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Press Releases</h2>
            <p className="text-muted-foreground mt-1">Official statements and announcements</p>
          </div>
          {isAdmin && <Button onClick={() => setShowForm(true)} className="rounded-full gap-2 bg-red-600 hover:bg-red-700"><Plus className="w-4 h-4" /> Add Release</Button>}
        </div>
        <button
          onClick={async () => {
            const res = await fetch(MEDIA_KIT_URL);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'DrewGrimaldiPodcastMediaKit.pdf'; a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full flex items-center justify-between gap-4 bg-primary/10 border border-primary/30 rounded-2xl px-6 py-5 mb-10 hover:bg-primary/20 transition-colors group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0"><Download className="w-6 h-6 text-primary" /></div>
            <div>
              <p className="font-bold text-foreground text-base">Download Official Media Kit</p>
              <p className="text-sm text-muted-foreground">Press photos, logos, bio and show info</p>
            </div>
          </div>
          <ExternalLink className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </button>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : releases.length === 0 ? (
          <div className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-20 text-muted-foreground gap-2"><FileText className="w-8 h-8" /><p className="text-sm">No press releases yet.</p></div>
        ) : (
          <div className="flex flex-col divide-y divide-border/40">
            {releases.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="py-6 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="shrink-0 sm:w-32 text-xs font-semibold text-primary uppercase tracking-widest pt-1">
                  {r.publish_date ? format(new Date(r.publish_date + 'T12:00:00'), 'MMM d, yyyy') : '—'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base sm:text-lg leading-snug">{r.headline}</h3>
                  {r.sub_headline && <p className="text-muted-foreground text-sm mt-1">{r.sub_headline}</p>}
                </div>
                <Button size="sm" variant="outline" onClick={() => setViewing(r)} className="rounded-full shrink-0 border-border/60 hover:border-primary/40">Read More</Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {viewing && <PressReleaseModal release={viewing} onClose={() => setViewing(null)} />}
      {showForm && <AdminPressForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
