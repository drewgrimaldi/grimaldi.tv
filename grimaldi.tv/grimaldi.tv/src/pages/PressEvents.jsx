import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import UpcomingLineup from '@/components/press/UpcomingLineup';
import PressReleases from '@/components/press/PressReleases';

export default function PressEvents() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Newspaper className="w-4 h-4 text-primary" /><span className="text-xs font-bold text-primary uppercase tracking-widest">Media Center</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-tight">Press <span className="text-primary">&amp;</span> Upcoming Guests</h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">Upcoming guests, official press releases, and media resources for The Drew Grimaldi Podcast.</p>
        </motion.div>
      </section>
      <UpcomingLineup />
      <PressReleases />
    </div>
  );
}
