'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';

const theme = extendTheme({
  colors: {
    red: {
      50: '#fee',
      100: '#ffd4d6',
      200: '#feafb4',
      300: '#fb8890',
      400: '#f66570',
      500: '#f04452',
      600: '#e42939',
      700: '#d22030',
      800: '#bc1b2a',
      900: '#a51926',
    },
    blue: {
      50: '#e8f3ff',
      100: '#c9e2ff',
      200: '#90c2ff',
      300: '#64a8ff',
      400: '#4593fc',
      500: '#3182f6',
      600: '#2272eb',
      700: '#1b64da',
      800: '#1957c2',
      900: '#194aa6',
    },
  },
});

export function Providers({ children }: PropsWithChildren<unknown>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
