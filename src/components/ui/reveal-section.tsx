'use client';

import { useEffect, useRef, useSyncExternalStore, useCallback } from 'react';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

export function RevealSection({ children, className = '' }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasRevealedRef = useRef(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const reveal = useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    ref.current?.classList.add('reveal-on-scroll');
    ref.current?.classList.remove('opacity-0');
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      reveal();
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, reveal]);

  return (
    <div
      ref={ref}
      className={`${className} opacity-0`}
    >
      {children}
    </div>
  );
}
