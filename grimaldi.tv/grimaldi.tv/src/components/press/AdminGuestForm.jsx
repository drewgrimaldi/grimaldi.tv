import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X, Loader2, Upload, User } from 'lucide-react';

export default function AdminGuestForm({ onClose }) {
  const [form, setForm] = useState({ name: '', title: '', headshot_url: '', air_date: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, headshot_url: file_url }));
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.UpcomingGuest.create(form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-foreground text-lg">Add Upcoming Guest</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2 block">Headshot Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-secondary flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                {preview || form.headshot_url ? <img src={preview || form.headshot_url} alt="Preview" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full rounded-xl gap-2">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1.5 text-center">JPG, PNG, WEBP supported</p>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          {[
            { key: 'name', label: 'Name', placeholder: 'Guest full name', required: true },
            { key: 'title', label: 'Title / Bio', placeholder: 'e.g. Author, Conservative Commentator' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} required={f.required}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 block">Air Date</label>
            <input type="date" value={form.air_date} onChange={e => setForm(prev => ({ ...prev, air_date: e.target.value }))}
              className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={saving || uploading} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Guest'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
