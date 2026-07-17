import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Headphones } from 'lucide-react';

export default function EmailGate({ onUnlock }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await base44.entities.Subscriber.create({ email, name });
    } catch (err) {
      // Duplicate email or other non-fatal issue — don't block access to the site over it.
      console.warn('Subscriber save issue (continuing anyway):', err);
    }
    localStorage.setItem('dgp_subscriber_email', email);
    setLoading(false);
    onUnlock();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }} />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md bg-card border border-border/50 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><Headphones className="w-7 h-7 text-primary" /></div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">Watch Free</h2>
        <p className="text-muted-foreground mb-8">Enter your email to unlock all episodes of The Drew Grimaldi Podcast.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="bg-background border-border/50 h-11" />
          <Input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background border-border/50 h-11" required />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full h-11 rounded-full font-semibold" disabled={loading}>{loading ? 'Unlocking...' : 'Watch Now →'}</Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">No spam, ever. Unsubscribe anytime.</p>
      </motion.div>
    </div>
  );
}
