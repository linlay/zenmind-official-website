import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useRevealOnScroll() {
  const location = useLocation();

  useEffect(() => {
    const revealSelector = '[data-reveal], [data-reveal-no-blur]';
    const elements = Array.from(document.querySelectorAll(revealSelector));
    if (!elements.length) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);
}
