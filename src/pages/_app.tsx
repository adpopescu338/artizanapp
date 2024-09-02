import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import NextNprogress from 'nextjs-progressbar'
import { ReactQueryDevtools } from 'react-query/devtools'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { Footer } from '@/components/Footer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const SEO = {
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    // url: 'https://weddster.co.uk/',
    site_name: 'Artizanapp',
  },
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#6B8E23', // Olive Drab
      light: '#9ACD32', // Yellow Green
      dark: '#556B2F', // Dark Olive Green
    },
    secondary: {
      main: '#D2691E', // Chocolate
      light: '#FF7F50', // Coral
      dark: '#8B4513', // Saddle Brown
    },
    error: {
      main: '#D32F2F', // Red
      light: '#FF6659', // Light Red
      dark: '#9A0007', // Dark Red
    },
    warning: {
      main: '#FFA500', // Orange
      light: '#FFB74D', // Light Orange
      dark: '#FF8C00', // Dark Orange
    },
    info: {
      main: '#1E90FF', // Dodger Blue
      light: '#6CA6CD', // Light Blue
      dark: '#104E8B', // Dark Blue
    },
    success: {
      main: '#4CAF50', // Green
      light: '#81C784', // Light Green
      dark: '#388E3C', // Dark Green
    },
    background: {
      default: '#FAF9F6', // Linen (warm, natural tone)
      paper: '#FFFFFF', // Pure White for clean sections
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Artizanapp</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <SessionProvider
        session={pageProps.session?.data}
        basePath={`/api/auth/next-auth`}
        baseUrl='/api/auth/next-auth'
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <Navbar />
            <DefaultSeo {...SEO} />
            <NextNprogress options={{ showSpinner: false }} />
            <PageWrapper>
              <Component {...pageProps} />
            </PageWrapper>
            <Footer />
          </ThemeProvider>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}
