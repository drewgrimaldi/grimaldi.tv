import { motion } from 'framer-motion';

const platforms = [
  { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-drew-grimaldi-podcast/id1655465436', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6a8.4 8.4 0 1 1 0 16.8A8.4 8.4 0 0 1 12 3.6zm0 1.8a6.6 6.6 0 1 0 0 13.2A6.6 6.6 0 0 0 12 5.4zm0 1.8a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2.4a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2zm-1.2 2.4c0-.663.537-1.2 1.2-1.2s1.2.537 1.2 1.2v3.6a1.2 1.2 0 0 1-2.4 0V12z"/></svg>) },
  { name: 'Rumble', href: 'https://rumble.com/drewgrimaldi', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 13.5l-6 3.5V7l6 3.5v3z"/></svg>) },
  { name: 'X', href: 'https://x.com/Grimillionaire', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>) },
  { name: 'BlueSky', href: 'https://bsky.app/profile/grimaldi.tv', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 10.5c-2.25-3-4.5-5.25-6-5.25-1.5 0-3 1.5-3 3.75C3 11.25 6 18 12 21.75c6-3.75 9-10.5 9-12.75 0-2.25-1.5-3.75-3-3.75-1.5 0-3.75 2.25-6 5.25z"/></svg>) },
  { name: 'TikTok', href: 'https://www.tiktok.com/@thedrewgrimaldipodcast', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>) },
  { name: 'Instagram', href: 'https://instagram.com/TheDrewGrimaldiPodcast', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>) },
  { name: 'Twitch', href: 'https://twitch.tv/grimillionaire', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>) },
  { name: 'Truth Social', href: 'https://truthsocial.com/@drewmgrimaldi', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 7h-11v2h4.5v8h2V9H17.5V7z"/></svg>) },
];

export default function PlatformLinks() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex flex-nowrap items-center justify-center gap-2">
      {platforms.map((p) => (
        <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" title={p.name}
          className="flex items-center px-1.5 py-1 rounded-full bg-secondary/70 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-200">
          <div className="w-4 h-4">{p.icon}</div>
          <span className="hidden sm:inline text-xs">{p.name}</span>
        </a>
      ))}
    </motion.div>
  );
}
