import { useCallback, useEffect, useState } from 'react';
import { apiBase, apiRequest } from './api';

const downloadCountStoragePrefix = 'zenmind:download-counted:';

function downloadCountedStorageKey(installerKey, version) {
  if (version) {
    return `${downloadCountStoragePrefix}${installerKey}:${version}`;
  }
  return `${downloadCountStoragePrefix}${installerKey}`;
}

export function hasCountedDownload(installerKey, version) {
  try {
    return window.localStorage.getItem(downloadCountedStorageKey(installerKey, version)) === '1';
  } catch {
    return false;
  }
}

export function markDownloadCounted(installerKey, version) {
  try {
    window.localStorage.setItem(downloadCountedStorageKey(installerKey, version), '1');
  } catch {
    // The download should continue even when browser storage is unavailable.
  }
}

export function recordDownloadEvent(installerKey, version) {
  fetch(`${apiBase}/downloads/events`, {
    method: 'POST',
    credentials: 'include',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ installerKey, version }),
  }).catch(() => {});
}

export function useDownloadTotals() {
  const [totals, setTotals] = useState({});

  useEffect(() => {
    let cancelled = false;

    apiRequest('/downloads/stats')
      .then((data) => {
        if (!cancelled) {
          setTotals(data.totals || {});
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTotals({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const incrementLocalTotal = useCallback((installerKey) => {
    setTotals((current) => ({
      ...current,
      [installerKey]: Number(current[installerKey] || 0) + 1,
    }));
  }, []);

  return { totals, incrementLocalTotal };
}
