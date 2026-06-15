import { HomePage } from '../pages/home/HomePage';
import { DownloadPage } from '../pages/download/DownloadPage';
import { DocumentsPage } from '../pages/documents/DocumentsPage';
import { NewsPage } from '../pages/news/NewsPage';
import { LoginPage } from '../pages/login/LoginPage';
import { AdminLoginPage } from '../pages/admin-login/AdminLoginPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { AdminPage } from '../pages/admin/AdminPage';
import { AuthFailurePage } from '../pages/auth-failure/AuthFailurePage';

export const pageOrder = ['home', 'documents', 'news', 'download'];

export const routeOrder = [
  'home',
  'download',
  'documents',
  'news',
  'login',
  'profile',
  'adminLogin',
  'admin',
  'authFailure',
];

export function getPageElement({ lang, pageKey, auth }) {
  const pages = {
    home: <HomePage lang={lang} auth={auth} />,
    download: <DownloadPage lang={lang} />,
    documents: <DocumentsPage lang={lang} />,
    news: <NewsPage lang={lang} />,
    login: <LoginPage lang={lang} auth={auth} />,
    profile: <ProfilePage lang={lang} auth={auth} />,
    adminLogin: <AdminLoginPage lang={lang} auth={auth} />,
    admin: <AdminPage lang={lang} auth={auth} />,
    authFailure: <AuthFailurePage lang={lang} />,
  };

  return pages[pageKey];
}
