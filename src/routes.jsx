import { createBrowserRouter } from 'react-router';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import PageSkeleton from './components/PageSkeleton';

// Home ships with the entry bundle (LCP page); every other page is its own lazy chunk.
const page = (load) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    hydrateFallbackElement: <PageSkeleton />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', lazy: page(() => import('./pages/About')) },
      { path: '/services', lazy: page(() => import('./pages/Services')) },
      { path: '/gallery', lazy: page(() => import('./pages/GalleryHub')) },
      { path: '/gallery/:category', lazy: page(() => import('./pages/GalleryCategory')) },
      { path: '/clients', lazy: page(() => import('./pages/Clients')) },
      { path: '/faq', lazy: page(() => import('./pages/Faq')) },
      { path: '/contact', lazy: page(() => import('./pages/Contact')) },
      { path: '*', lazy: page(() => import('./pages/NotFound')) },
    ],
  },
]);

export default router;
