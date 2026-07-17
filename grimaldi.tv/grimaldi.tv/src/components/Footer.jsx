import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5"></div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link to="/Home" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/Episodes" className="hover:text-foreground transition-colors">Episodes - LIVE*</Link>
            <Link to="/Store" className="hover:text-foreground transition-colors">Podcast Merchandise</Link>
            <Link to="/FunnyPhotos" className="hover:text-foreground transition-colors">Photo Gallery</Link>
            <a href="https://studio.grimaldi.tv" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Login</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} The Drew Grimaldi Podcast. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
