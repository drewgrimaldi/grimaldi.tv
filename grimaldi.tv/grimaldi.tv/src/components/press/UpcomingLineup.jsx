import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Loader2, CheckCircle } from 'lucide-react';
import GuestCard from './GuestCard';
import AdminGuestForm from './AdminGuestForm';

export default function UpcomingLineup() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);

  const { data: guests = [], isLoading, refetch } = useQuery({
    queryKey: ['upcoming-guests'],
    queryFn: () => base44.entities.UpcomingGuest.list('air_date', 50),
  });

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.PollResponse.create({ question: 'Guest Question', answer: question });
    } catch (err) {
      console.error('Saving question to database failed:', err);
    }

    try {
      await base44.integrations.Core.SendEmail({
        to: 'drew@grimaldi.tv',
        subject: 'New Question Submitted on The Drew Grimaldi Podcast',
        body: `A listener submitted a question:\n\n"${question}"`,
      });
    } catch (err) {
      console.error('Question email notification failed:', err);
    }
    setSubmitting(false);
    setSubmitted(true);
    setQuestion('');
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Upcoming Lineup</h2>
            <p className="text-muted-foreground mt-1">Guests coming up on the show</p>
          </div>
          {isAdmin && <Button onClick={() => setShowAdminForm(true)} className="rounded-full gap-2 bg-red-600 hover:bg-red-700"><Plus className="w-4 h-4" /> Add Guest</Button>}
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : guests.length === 0 ? (
          <div className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center py-20 text-muted-foreground gap-2"><p className="text-sm">No upcoming guests added yet.</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {guests.map((g, i) => <GuestCard key={g.id} guest={g} index={i} />)}
          </div>
        )}
        <div className="mt-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Submit a Question</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-5">Have a question for an upcoming guest? Submit it below and we may ask it on the show.</p>
          {submitted ? (
            <div className="flex items-center gap-2 text-green-400 font-semibold"><CheckCircle className="w-5 h-5" /> Question submitted! Thanks.</div>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="flex flex-col sm:flex-row gap-3">
              <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question here..."
                className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <Button type="submit" disabled={submitting || !question.trim()} className="rounded-xl bg-red-600 hover:bg-red-700 px-6">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
              </Button>
            </form>
          )}
        </div>
      </div>
      {showAdminForm && <AdminGuestForm onClose={() => { setShowAdminForm(false); refetch(); }} />}
    </section>
  );
}
