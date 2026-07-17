import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

const navLinks = [
  { label: 'Home', path: '/Home' },
  { label: 'Episodes', path: '/Episodes' },
  { label: 'Photo Gallery', path: '/FunnyPhotos' },
  { label: 'Blog', path: '/Blog' },
  { label: 'Sportsbook', path: 'https://ai.grimaldi.tv', isExternal: true },
  { label: 'Podcast Merchandise', path: '/Store' },
  { label: 'Press & Upcoming Guests', path: '/PressEvents' },
];

function useIsLiveNow() {
  const now = new Date();
  const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = nyTime.getDay();
  const hour = nyTime.getHours();
  const minute = nyTime.getMinutes();
  const totalMinutes = hour * 60 + minute;
  return day === 6 && totalMinutes >= 660 && totalMinutes < 720;
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLive = useIsLiveNow();

  return (
    <div className="min-h-screen bg-[rgba(25,25,200,1)] flex flex-col relative overflow-x-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20 pointer-events-none"
        style={{ backgroundImage: "url('https://media.base44.com/images/public/69b6b824807a75fd2d45c448/0f43c768b_IMG_4167.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md -z-20 pointer-events-none" />

      {isLive && (
        <a
          href="/Episodes"
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#3a3a3a]/90 backdrop-blur-sm text-white px-5 py-3 rounded-2xl shadow-2xl hover:bg-[#4a4a4a]/90 transition-colors cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
            <span className="absolute inline-block w-6 h-6 rounded-full bg-red-500 animate-ping opacity-60" />
            <span className="relative inline-block w-4 h-4 rounded-full bg-red-500" />
          </div>
          <span className="font-bold text-base tracking-wide">LIVE NOW</span>
        </a>
      )}

      <a
        href="https://mypillow.com/GRIM"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-14 left-0 right-0 z-40 bg-red-600 text-white py-3 text-center text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer block"
      >
        USE PROMO CODE: <span className="font-bold">GRIM</span> at MyPillow.com
      </a>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[rgba(25,25,200,1)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
          <button className="md:hidden text-white" onClick={() => setMenuOpen(true)} type="button" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/Home" className="flex-1 flex justify-center md:flex-none md:justify-start md:mr-auto">
            <img
              src="https://media.base44.com/images/public/69b6b824807a75fd2d45c448/2feb11d36_Usablue.jpg"
              alt="The Drew Grimaldi Podcast"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            {navLinks.map((link) => {
              if (link.isExternal) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-200 hover:text-white whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-white' : 'text-slate-200 hover:text-white'}`}
                >
                  {link.label}
                  {link.path === '/Episodes' && isLive && (
                    <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" />
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 z-[60] h-full w-72 bg-[rgba(25,25,200,1)] border-r border-white/10 shadow-2xl md:hidden"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="h-14 px-5 flex items-center justify-between border-b border-white/10">
                <span className="text-white font-semibold tracking-wide">MENU</span>
                <button onClick={() => setMenuOpen(false)} type="button" aria-label="Close menu" className="text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-5 py-6 flex flex-col">
                {navLinks.map((link) => {
                  if (link.isExternal) {
                    return (
                      <a
                        key={link.path}
                        href={link.path}
                        onClick={() => setMenuOpen(false)}
                        className="relative px-4 py-3 text-sm font-medium transition-colors border-b border-white/10 text-slate-200 hover:text-white"
                      >
                        {link.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`relative px-4 py-3 text-sm font-medium transition-colors border-b border-white/10 ${location.pathname === link.path ? 'text-white' : 'text-slate-200 hover:text-white'}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24">
        <Outlet />
      </main>

      <div className="bg-[rgba(25,25,200,1)]">
        <Footer />
      </div>
    </div>
  );
}
