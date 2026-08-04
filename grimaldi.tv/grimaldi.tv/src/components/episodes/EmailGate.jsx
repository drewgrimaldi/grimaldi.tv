import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Headphones, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function EmailGate({ onUnlock, title, description, buttonText, icon: Icon = Headphones }) {
  const { isAuthenticated } = useAuth();
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
      console.warn('Subscriber save issue (continuing anyway):', err);
    }
    localStorage.setItem('dgp_subscriber_email', email);
    setLoading(false);
    if (onUnlock) onUnlock();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border/50 rounded-2xl p-8 sm:p-10 text-center shadow-xl my-8">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {title || "Unlock Full Access"}
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base mb-6">
        {description || "Enter your email or sign in to your account to unlock full access."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        <Input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background border-border/50 h-11"
        />
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background border-border/50 h-11"
          required
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full h-11 rounded-full font-semibold" disabled={loading}>
          {loading ? 'Unlocking...' : (buttonText || 'Unlock Now →')}
        </Button>
      </form>
      <div className="mt-5 pt-4 border-t border-border/40 flex flex-col items-center gap-2">
        {!isAuthenticated && (
          <p className="text-sm text-foreground/90 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Sign In
            </Link>
          </p>
        )}
        <p className="text-xs text-muted-foreground">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}

