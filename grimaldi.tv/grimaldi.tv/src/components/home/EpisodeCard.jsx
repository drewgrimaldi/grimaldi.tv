import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ExternalLink, X, Play } from 'lucide-react';
import { format } from 'date-fns';

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
function getCloudflareEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('/iframe')) return url;
  const parts = url.split('/manifest/');
  if (parts.length > 1) return parts[0] + '/iframe';
  return url;
}
function getRumbleId(url) {
  if (!url) return null;
  const match = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)/i);
  return match ? match[1] : null;
}

export default function EpisodeCard({ episode, index = 0 }) {
  const [modalOpen, setModalOpen] = useState(false);
  const youtubeId = getYouTubeId(episode.youtube_url);
  const cloudflareEmbed = getCloudflareEmbedUrl(episode.cloudflare_url);
  const rumbleId = getRumbleId(episode.rumble_url);

  const hasVideo = !!(youtubeId || cloudflareEmbed || rumbleId);
  const thumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : episode.cover_image_url || null;
  const hasDetail = !!(episode.description || episode.rumble_url || episode.youtube_url || episode.spotify_url || episode.apple_url || episode.duration || hasVideo);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
      >
        <button
          type="button"
          onClick={() => hasVideo && setModalOpen(true)}
          className="relative aspect-video w-full block bg-gradient-to-br from-secondary to-primary/10"
          disabled={!hasVideo}
        >
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={episode.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No video available</p>
            </div>
          )}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/40 transition-colors">
              <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </button>

        <div className="px-4 pt-3 pb-1 flex flex-col gap-1">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{episode.title}</h3>
          {episode.guest && <p className="text-xs text-primary/80 font-medium">with {episode.guest}</p>}
          {episode.publish_date && !isNaN(new Date(episode.publish_date + 'T12:00:00')) && (
            <div className="flex items-center gap-1.5 text-primary font-semibold text-xs">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(episode.publish_date + 'T12:00:00'), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {hasDetail && (
          <button onClick={() => setModalOpen(true)} className="w-full text-left px-4 py-2 text-xs text-primary hover:text-primary/80 font-semibold underline underline-offset-2 transition-colors">
            {hasVideo ? 'Watch / More info' : 'More info'}
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
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10 bg-card/80 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>

              {hasVideo && (
                <div className="aspect-video bg-black">
                  {youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                      title={episode.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : cloudflareEmbed ? (
                    <iframe
                      src={cloudflareEmbed}
                      title={episode.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : rumbleId ? (
                    <iframe
                      src={`https://rumble.com/embed/${rumbleId}`}
                      title={episode.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 'none' }}
                    />
                  ) : null}
                </div>
              )}

              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h2 className="font-bold text-foreground text-xl leading-tight pr-8">{episode.title}</h2>
                  {episode.guest && <p className="text-sm text-primary/80 font-medium mt-1">with {episode.guest}</p>}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {episode.publish_date && !isNaN(new Date(episode.publish_date + 'T12:00:00')) && (
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(episode.publish_date + 'T12:00:00'), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {episode.duration && (
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>{episode.duration}</span></div>
                  )}
                </div>
                {episode.description && <p className="text-sm text-muted-foreground leading-relaxed">{episode.description}</p>}
                {(episode.rumble_url || episode.youtube_url || episode.spotify_url || episode.apple_url) && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {episode.youtube_url && <a href={episode.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors">Watch on YouTube <ExternalLink className="w-3.5 h-3.5" /></a>}
                    {episode.rumble_url && <a href={episode.rumble_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors">Watch on Rumble <ExternalLink className="w-3.5 h-3.5" /></a>}
                    {episode.spotify_url && <a href={episode.spotify_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors">Listen on Spotify <ExternalLink className="w-3.5 h-3.5" /></a>}
                    {episode.apple_url && <a href={episode.apple_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors">Listen on Apple Podcasts <ExternalLink className="w-3.5 h-3.5" /></a>}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
