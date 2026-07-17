import { motion } from 'framer-motion';
import { Play, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PlatformLinks from './PlatformLinks';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')", filter: "blur(0px)" }}
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full flex flex-col items-center">
        <div className="max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex flex-col items-center gap-1 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 -mb-2">
              <div className="flex items-center gap-2">
                 <Headphones className="w-5 h-5 text-primary" />
                 <span className="text-base font-bold text-white uppercase tracking-widest">New Episodes Weekly</span>
               </div>
               <span className="text-xs text-muted-foreground">Only available in English</span>
               <span className="text-[10px] italic text-muted-foreground">Never Retreat. Never Surrender</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-0 flex justify-center">
            <img
              src="https://media.base44.com/images/public/69b6b824807a75fd2d45c448/a600305f2_C127E994-6269-48A4-9A89-4C004C12DB60.png"
              alt="The Drew Grimaldi Podcast Logo"
              className="w-[28rem] h-[28rem] sm:w-[33.6rem] sm:h-[33.6rem] object-contain drop-shadow-2xl"
            />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-0 text-lg sm:text-xl md:text-2xl text-white leading-relaxed">
            Comedy, Politics, and Entertainment. The Drew Grimaldi Podcast featuring Drew Grimaldi. Follow the show on X @Grimillionaire LIVESTREAM every Saturday at 11AM EST at GRIMALDI.TV
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-10 flex flex-col gap-4 justify-center items-center">
            <Link to="/Episodes" className="w-full flex justify-center">
              <Button size="lg" className="gap-2 rounded-full px-10 py-6 text-lg font-semibold bg-red-600 hover:bg-red-700">
                <Play className="w-5 h-5" /> Watch Live Now!
              </Button>
            </Link>
            <Link to="/Store" className="w-full flex justify-center">
              <Button size="lg" className="rounded-full px-8 font-semibold bg-red-600 hover:bg-red-700">Podcast Merchandise</Button>
            </Link>
            <Link to="/FunnyPhotos" className="w-full flex justify-center">
              <Button size="lg" className="rounded-full px-8 font-semibold bg-red-600 hover:bg-red-700">Photo Gallery</Button>
            </Link>
            <a href="https://www.paypal.com/donate?business=drewgrimaldi@gmail.com&currency_code=USD" target="_blank" rel="noopener noreferrer" className="w-full flex justify-center">
              <Button size="lg" className="rounded-full px-8 font-semibold bg-blue-600 hover:bg-blue-700">DONATE</Button>
            </a>
          </motion.div>
          <PlatformLinks />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-6 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-primary text-center mb-6">GOD BLESS THE USA!</h2>
            <img src="https://media.base44.com/images/public/69b6b824807a75fd2d45c448/e5f134683_72E884AA-8202-425E-9CE1-10C4D57A6505.png" alt="Drew Grimaldi" className="w-full rounded-2xl shadow-2xl mb-4" />
            <img src="https://media.base44.com/images/public/69b6b824807a75fd2d45c448/4f52eba2e_36E061AF-CCF0-4E44-B700-5D2C55627D67.png" alt="Drew Grimaldi" className="w-full rounded-2xl shadow-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
