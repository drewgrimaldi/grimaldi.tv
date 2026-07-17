import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const DAILY_QUESTIONS = [
  "What's your take on the latest political news?",
  "Which entertainment news story caught your attention this week?",
  "What's your opinion on current economic trends?",
  "How do you feel about the latest sports headlines?",
  "What's your stance on recent tech developments?",
  "Which celebrity moment is on your mind right now?",
  "What do you think about recent weather/climate news?",
  "Your thoughts on the latest movie or TV show release?",
];

export default function PollWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const getQuestionOfDay = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('pollDate');
    if (savedDate !== today) {
      const randomIdx = Math.floor(Math.random() * DAILY_QUESTIONS.length);
      localStorage.setItem('pollDate', today);
      localStorage.setItem('pollQuestion', DAILY_QUESTIONS[randomIdx]);
    }
    return localStorage.getItem('pollQuestion') || DAILY_QUESTIONS[0];
  };

  const question = getQuestionOfDay();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setLoading(true);
    try {
      await base44.entities.PollResponse.create({ question, answer, email: email || undefined });
      await base44.functions.invoke('sendPollResponse', { question, answer, email });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setAnswer('');
        setEmail('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-24 right-6 z-50 bg-card border border-border/50 rounded-2xl shadow-xl p-6 w-80 max-w-[calc(100vw-2rem)]"
              initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Today's Question</h3>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {submitted ? (
                <div className="text-center py-6">
                  <p className="text-sm text-primary font-semibold">Thank you! 🎉</p>
                  <p className="text-xs text-muted-foreground mt-1">Your response has been recorded.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-foreground mb-4">{question}</p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                      placeholder="Your answer..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
                      required
                    />
                    <Input
                      type="email" placeholder="Your email (optional)" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary border-border/50 h-8 text-sm"
                    />
                    <Button type="submit" disabled={!answer.trim() || loading} className="w-full h-8 text-sm gap-2 rounded-lg">
                      <Send className="w-3 h-3" />
                      {loading ? 'Sending...' : 'Send'}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
