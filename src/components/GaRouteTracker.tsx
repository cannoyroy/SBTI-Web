import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/ga';

export const GaRouteTracker = () => {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    if (lastTrackedPath.current === path) {
      return;
    }

    lastTrackedPath.current = path;
    trackPageView(path);
  }, [location.hash, location.pathname, location.search]);

  return null;
};
