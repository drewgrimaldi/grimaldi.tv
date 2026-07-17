import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }} />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4 text-muted-foreground">
            <h1 className="font-display text-4xl font-bold text-foreground mb-8">About <span className="text-primary">the Show</span></h1>
            <p className="text-lg text-foreground">Comedy, Politics, and Entertainment. The Drew Grimaldi Podcast featuring Drew Grimaldi.</p>
            <p>Follow the show on X <a href="https://twitter.com/Grimillionaire" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Grimillionaire</a></p>
            <p>🔴 LIVESTREAM every <span className="text-foreground font-medium">Saturday at 11AM EST</span> at <a href="https://grimaldi.tv" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GRIMALDI.TV</a></p>
            <p>🛏️ Use promo code <span className="text-foreground font-semibold">GRIM</span> at <a href="https://mypillow.com/GRIM" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MyPillow.com/GRIM</a> for special offers!</p>
            <p>📧 Email: <a href="mailto:drew@grimaldi.tv" className="text-primary hover:underline">drew@grimaldi.tv</a></p>
            <p>📰 Press Inquiries: <a href="mailto:press@grimaldi.tv" className="text-primary hover:underline">press@grimaldi.tv</a></p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
