export const defaultSEO = {
  defaultTitle: 'Goubara Yoshiyuki | 郷原 芳幸',
  description: '郷原 芳幸のポートフォリオサイトです。Web制作に特化したフリーランスのデザイナー兼ディレクターです。',
  canonical: process.env.NEXT_PUBLIC_BASE_URL,
  openGraph: {
    type: 'website',
    title: 'Goubara Yoshiyuki | 郷原 芳幸',
    description: '郷原 芳幸のポートフォリオサイトです。Web制作に特化したフリーランスのデザイナー兼ディレクターです。',
    site_name: 'Goubara Yoshiyuki | 郷原 芳幸',
    url: '',
    images: [
      {
        url: '/img/ogp.jpg',
        width: 1000,
        height: 410,
        alt: 'Goubara Yoshiyuki | 郷原 芳幸',
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
