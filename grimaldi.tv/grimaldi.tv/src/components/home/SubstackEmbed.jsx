import { motion } from 'framer-motion';

export default function SubstackEmbed() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 flex flex-col items-center">
      <p className="text-white text-lg font-semibold mb-4">Subscribe on Substack</p>
      <iframe
        src="https://thedrewgrimaldipodcast.substack.com/embed"
        width="480" height="150"
        style={{ border: '1px solid #EEE', background: 'white', borderRadius: '12px', maxWidth: '100%' }}
        frameBorder="0" scrolling="no"
        title="Subscribe to The Drew Grimaldi Podcast on Substack"
      />
    </motion.div>
  );
}
