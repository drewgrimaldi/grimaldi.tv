import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function FeedbackSection() {
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.PollResponse.create({ question: 'Show Feedback', answer: feedback });
    } catch (err) {
      console.warn('Saving feedback to database failed:', err);
    }

    try {
      await base44.integrations.Core.SendEmail({
        to: 'drew@grimaldi.tv',
        subject: 'New Show Feedback from The Drew Grimaldi Podcast',
        body: `A listener submitted feedback:\n\n"${feedback}"`,
      });
    } catch (err) {
      console.warn('Feedback email notification failed:', err);
      alert(`Email sending failed: ${err.message}`);
    }
    setSubmitting(false);
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <section className="py-16 px-6 relative">
      <div className="max-w-xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
          <p className="text-xl text-foreground font-semibold">Tell us what you think of the show</p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
              <CheckCircle className="w-5 h-5" /> Thanks for your feedback!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Share your thoughts..."
                className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" disabled={submitting || !feedback.trim()} className="rounded-xl bg-red-600 hover:bg-red-700 px-6 shrink-0">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
