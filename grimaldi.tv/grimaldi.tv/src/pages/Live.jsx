import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import EmailGate from '../components/episodes/EmailGate';
import Hls from 'hls.js';

function HlsPlayer({ src }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  }, [src]);
  return <video ref={videoRef} controls autoPlay className="w-full h-full bg-black" />;
}

export default function Live() {
  const [unlocked, setUnlocked] = useState(() => !!localStorage.getItem('dgp_subscriber_email'));
  if (!unlocked) return <EmailGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }} />
      <div className="fixed inset-0 bg-background/60 backdrop-blur-md -z-10" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="mb-6 text-muted-foreground text-lg font-medium text-center">Made in the USA 🇺🇸</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe src="https://www.youtube.com/embed/live_stream?channel=UCVAWw_eRsAfCqujFhA_ja9g"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </motion.div>
        <div className="mt-6 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2"><Radio className="w-5 h-5 text-red-500 animate-pulse" /><p className="text-foreground text-2xl font-bold tracking-widest uppercase">Livestream</p></div>
          <p className="text-muted-foreground text-sm">Hosted by Drew Grimaldi</p>
        </div>
        <img src="https://media.base44.com/images/public/69b6b824807a75fd2d45c448/018c63bad_7406B4F7-0D48-4D70-AB1C-F4D9A84A4F23.png" alt="Drew Grimaldi" className="mt-6 w-full rounded-2xl shadow-2xl" />
        <p className="mt-4 text-center text-foreground text-lg font-semibold">Trigger A Libtard Today!</p>
      </div>
    </div>
  );
}
