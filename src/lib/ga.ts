type GtagCommand = 'js' | 'config' | 'event';

type GtagFn = (command: GtagCommand, target: string | Date, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: GtagFn;
  }
}

const gaMeasurementId = import.meta.env.VITE_GA_ID as string | undefined;
const gtagScriptId = 'ga4-gtag-script';
let initialized = false;

const hasMeasurementId = () => Boolean(gaMeasurementId && gaMeasurementId.trim().length > 0);

const ensureGtagStub = () => {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args) => {
      window.dataLayer.push(args);
    };
  }
};

const injectGtagScript = () => {
  if (document.getElementById(gtagScriptId)) {
    return;
  }

  const script = document.createElement('script');
  script.id = gtagScriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  document.head.appendChild(script);
};

export const initGa = () => {
  if (typeof window === 'undefined' || initialized || !hasMeasurementId()) {
    return;
  }

  ensureGtagStub();
  injectGtagScript();

  window.gtag?.('js', new Date());
  window.gtag?.('config', gaMeasurementId as string, { send_page_view: false });
  initialized = true;
};

export const trackPageView = (pagePath: string) => {
  if (typeof window === 'undefined' || !hasMeasurementId()) {
    return;
  }

  initGa();
  window.gtag?.('event', 'page_view', {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !hasMeasurementId()) {
    return;
  }

  initGa();
  window.gtag?.('event', name, params);
};
