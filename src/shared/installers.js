import { useEffect, useMemo, useState } from 'react';
import { desktopInstallerPlatforms } from '../content';
import { apiRequest } from './api';

function normalizeCatalogInstaller(installer) {
  return {
    key: installer.key,
    available: Boolean(installer.available && installer.href && installer.version),
    version: installer.version || null,
    href: installer.href || null,
    fileName: installer.fileName || null,
    sizeBytes: Number(installer.sizeBytes || 0),
    sha256: installer.sha256 || '',
    updatedAt: installer.updatedAt || null,
  };
}

function mergeInstallerCatalog(catalogInstallers) {
  const dynamicByKey = new Map((catalogInstallers || []).map((installer) => [installer.key, normalizeCatalogInstaller(installer)]));
  return desktopInstallerPlatforms.map((platform) => {
    const dynamic = dynamicByKey.get(platform.key);
    return {
      ...platform,
      available: Boolean(dynamic?.available),
      version: dynamic?.version || null,
      href: dynamic?.href || null,
      fileName: dynamic?.fileName || null,
      sizeBytes: dynamic?.sizeBytes || 0,
      sha256: dynamic?.sha256 || '',
      updatedAt: dynamic?.updatedAt || null,
    };
  });
}

export function maintenanceDesktopInstallers() {
  return mergeInstallerCatalog([]);
}

export function useDesktopInstallers() {
  const [state, setState] = useState({
    installers: maintenanceDesktopInstallers(),
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    apiRequest('/installers')
      .then((data) => {
        if (!cancelled) {
          setState({
            installers: mergeInstallerCatalog(data.installers || []),
            loading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            installers: maintenanceDesktopInstallers(),
            loading: false,
            error,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => state, [state]);
}
