import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_CONFIG } from '@/utils/constants';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Thầy HOTB',
    'học lập trình',
    'thiết kế đồ họa',
    'Figma UI UX',
    'HTML CSS thực chiến',
    'JavaScript',
    'ReactJS',
    'Next.js',
    'Digital Marketing',
    'AI ứng dụng',
    'học web miễn phí',
  ],
  authors: [{ name: SITE_CONFIG.instructor.name }],
  creator: SITE_CONFIG.instructor.name,
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_CONFIG.siteUrl,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.title,
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.siteUrl}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // Schema.org Person & EducationalOrganization
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.instructor.name,
    jobTitle: SITE_CONFIG.instructor.title,
    description: SITE_CONFIG.instructor.bio,
    url: SITE_CONFIG.siteUrl,
    sameAs: [
      SITE_CONFIG.socialLinks.youtube,
      SITE_CONFIG.socialLinks.facebook,
      SITE_CONFIG.socialLinks.linkedin,
      SITE_CONFIG.socialLinks.github,
    ],
  };

  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
