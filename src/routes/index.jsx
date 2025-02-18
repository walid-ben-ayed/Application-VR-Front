import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { Page as SignInPage } from '@/pages/auth/custom/sign-in';
import { Page as NotFoundPage } from '@/pages/not-found';

import { route as authRoute } from './auth';
import { route as componentsRoute } from './components';
import { route as dashboardRoute } from './dashboard';

export const routes = [
  {
    element: (
        <Outlet />
    ),
    children: [
      { index: true, element: <SignInPage /> }, // Page de connexion par défaut
      {
        path: 'auth/custom/sign-in', // ➡ Ajout de la route spécifique
        element: <SignInPage />,
      },
      {
        path: 'pricing',
        lazy: async () => {
          const { Page } = await import('@/pages/marketing/pricing');
          return { Component: Page };
        },
      },
      componentsRoute,
    ],
  },
  {
    path: 'errors',
    children: [
      {
        path: 'internal-server-error',
        lazy: async () => {
          const { Page } = await import('@/pages/errors/internal-server-error');
          return { Component: Page };
        },
      },
      {
        path: 'not-authorized',
        lazy: async () => {
          const { Page } = await import('@/pages/errors/not-authorized');
          return { Component: Page };
        },
      },
      {
        path: 'not-found',
        lazy: async () => {
          const { Page } = await import('@/pages/errors/not-found');
          return { Component: Page };
        },
      },
    ],
  },
  {
    path: 'checkout',
    lazy: async () => {
      const { Page } = await import('@/pages/checkout');
      return { Component: Page };
    },
  },
  {
    path: 'contact',
    lazy: async () => {
      const { Page } = await import('@/pages/contact');
      return { Component: Page };
    },
  },
  {
    path: 'pdf/invoices/:invoiceId',
    lazy: async () => {
      const { Page } = await import('@/pages/pdf/invoice');
      return { Component: Page };
    },
  },
  authRoute,
  dashboardRoute,
  { path: '*', element: <NotFoundPage /> },
];
