export const defaultSEO = {
  defaultTitle: 'GOUBARA YOSHIYUKI PORTFOLIO',
  description: '郷原 芳幸のポートフォリオサイトです。Web制作に特化したフリーランスのデザイナー兼ディレクターです。',
  canonical: process.env.NEXT_PUBLIC_BASE_URL,
  openGraph: {
    type: 'website',
    title: 'GOUBARA YOSHIYUKI PORTFOLIO',
    description: '郷原 芳幸のポートフォリオサイトです。Web制作に特化したフリーランスのデザイナー兼ディレクターです。',
    site_name: 'GOUBARA YOSHIYUKI PORTFOLIO',
    url: '',
    images: [
      {
        url: '/img/ogp.jpg',
        width: 1000,
        height: 410,
        alt: 'GOUBARA YOSHIYUKI PORTFOLIO',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    // handle: "@handle",
    // site: "@site",
    cardType: 'summary_large_image',
  },
};
export const worksSEO = {
  title: '制作実績 | GOUBARA YOSHIYUKI PORTFOLIO',
  description: 'Webデザイナー郷原 芳幸の制作実績をご紹介します。',
  canonical: `${process.env.NEXT_PUBLIC_BASE_URL}works`,
  openGraph: {
    title: '制作実績 | GOUBARA YOSHIYUKI PORTFOLIO',
    description: 'Webデザイナー郷原 芳幸の制作実績をご紹介します。',
  },
};
