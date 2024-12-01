import React from 'react';

const useMediaQuery = (mediaQuery: string) => {
  const [match, setMatch] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(mediaQuery);
    if (media?.matches !== match) {
      setMatch(media.matches);
    }
    const listener = () => setMatch(media?.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [match, mediaQuery]);

  return match;
};

export default useMediaQuery;
