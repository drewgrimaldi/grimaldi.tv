import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, X } from 'lucide-react';
import { format } from 'date-fns';

export default function GuestCard({ guest, index }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }}
        className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        {guest.headshot_url ? (
          <img src={guest.headshot_url} alt={guest.name} className="w-full h-56 object-cover object-top" />
        ) : (
          <div className="w-full h-56 bg-secondary flex items-center justify-center"><User className="w-10 h-10 text-muted-foreground/40" /></div>
        )}
        <div className="px-3 pt-2.5 pb-1 flex flex-col gap-1">
          <h3 className="font-bold text-foreground text-sm leading-tight">{guest.name}</h3>
          {guest.air_date && !isNaN(new Date(guest.air_date)) && (
            <div className="flex items-center gap-1.5 text-primary font-semibold text-xs">
              <Calendar className="w-3 h-3" /><span>{format(new Date(guest.air_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        {guest.title && (
          <button onClick={() => setModalOpen(true)} className="w-full text-left px-3 py-2 text-xs text-primary hover:text-primary/80 font-semibold underline underline-offset-2 transition-colors">
            More info
          </button>
        )}
      </motion.div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"><X className="w-5 h-5" /></button>
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                {guest.headshot_url ? (
                  <img src={guest.headshot_url} alt={guest.name} className="w-full sm:w-48 h-56 sm:h-auto object-cover object-top rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none shrink-0" />
                ) : (
                  <div className="w-full sm:w-48 h-48 bg-secondary flex items-center justify-center rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none shrink-0"><User className="w-12 h-12 text-muted-foreground/40" /></div>
                )}
                <div className="p-6 flex flex-col gap-3">
                  <h2 className="font-bold text-foreground text-xl leading-tight">{guest.name}</h2>
                  {guest.air_date && !isNaN(new Date(guest.air_date)) && (
                    <div className="flex items-center gap-1.5 text-primary font-semibold text-sm"><Calendar className="w-4 h-4" /><span>{format(new Date(guest.air_date), 'MMM d, yyyy')}</span></div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{guest.title}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
