import { useEffect, useState } from 'react';

export function normalizePlatform(value) {
  const source = String(value || '').toLowerCase();

  if (source.includes('mac') || source.includes('darwin')) {
    return 'mac';
  }

  if (source.includes('win')) {
    return 'windows';
  }

  if (source.includes('linux')) {
    return 'linux';
  }

  if (source.includes('unknown') || source.includes('other')) {
    return 'unknown';
  }

  return null;
}

export function detectDesktopPlatform() {
  const params = new URLSearchParams(window.location.search);
  const platformOverride = params.get('platform') || window.__ZENMIND_PLATFORM_OVERRIDE__;
  if (platformOverride) {
    return normalizePlatform(platformOverride) || 'unknown';
  }

  const userAgentDataPlatform = navigator.userAgentData?.platform;
  const platform = normalizePlatform(userAgentDataPlatform || navigator.platform);
  if (platform) {
    return platform;
  }

  return normalizePlatform(navigator.userAgent) || 'mac';
}

export function useDetectedDesktopPlatform() {
  const [platform, setPlatform] = useState('mac');

  useEffect(() => {
    setPlatform(detectDesktopPlatform());
  }, []);

  return platform;
}
