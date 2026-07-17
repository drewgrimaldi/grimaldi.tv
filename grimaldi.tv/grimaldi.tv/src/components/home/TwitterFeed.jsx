import { useEffect, useRef } from 'react';

export default function TwitterFeed() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.twttr) {
      window.twttr.widgets.load(ref.current);
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, []);
  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Latest from <span className="text-primary">@Grimillionaire</span></h2>
        <div ref={ref}>
          <a className="twitter-timeline" data-theme="dark" data-tweet-limit="3" href="https://twitter.com/Grimillionaire">Tweets by @Grimillionaire</a>
        </div>
      </div>
    </section>
  );
}
