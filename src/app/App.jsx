import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { routeMap } from '../content';
import { Footer } from '../shared/components/Footer';
import { Header } from '../shared/components/Header';
import { useAuthSession } from '../shared/hooks/use-auth-session';
import { useRevealOnScroll } from '../shared/hooks/use-reveal-on-scroll';
import { useThemeMode } from '../shared/hooks/use-theme-mode';
import { usePageMeta } from './page-meta';
import { getPageElement, routeOrder } from './routes';

function PageLayout({ lang, pageKey, theme, auth, children }) {
  useRevealOnScroll();
  usePageMeta(lang, pageKey);

  return (
    <div className="app-shell">
      <Header auth={auth} lang={lang} pageKey={pageKey} theme={theme} />
      <main className={`content-shell${pageKey === 'home' ? ' is-home-page' : ''}`}>{children}</main>
      <Footer lang={lang} />
    </div>
  );
}

function RoutedPage({ lang, pageKey, theme, auth }) {
  return (
    <PageLayout auth={auth} lang={lang} pageKey={pageKey} theme={theme}>
      {getPageElement({ lang, pageKey, auth })}
    </PageLayout>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  const theme = useThemeMode();
  const auth = useAuthSession();
  const routes = useMemo(
    () =>
      ['zh', 'en'].flatMap((lang) =>
        routeOrder.map((key) => ({
          path: routeMap[lang][key],
          lang,
          key,
        })),
      ),
    [],
  );

  return (
    <>
      <ScrollToTop />
      <Routes>
        {routes.map((route) => (
          <Route
            key={`${route.lang}-${route.key}`}
            path={route.path}
            element={<RoutedPage auth={auth} lang={route.lang} pageKey={route.key} theme={theme} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
