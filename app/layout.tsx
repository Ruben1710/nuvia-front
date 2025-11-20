import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Nuvia Print — Custom Gifts & Personalized Products | Sublimation Printing Vanadzor",
  description:
    "Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality sublimation printing. Տպագրություն, սուբլիմացիա, print vanadzor, tpargum.",
  metadataBase: new URL("https://nuviaprint.art"),
  keywords: [
    "տպագրություն",
    "սուբլիմացիա",
    "սուբլիմացիոն տպագրություն",
    "պատվերով տպագրություն",
    "բաժակների տպագրություն",
    "շորերի տպագրություն",
    "պատյանների տպագրություն",
    "ֆոտո տպագրություն",
    "ալյումինի վրա տպագրություն",
    "անհատական նվերներ",
    "տպագրություն Վանաձոր",
    "պատվերով նվերներ",
    "ստուդիա տպագրություն",
    "արագ տպագրություն",
    "tpargum",
    "sublimation armenia",
    "сублимация",
    "сублимационная печать",
    "печать на кружках",
    "печать на футболках",
    "печать на алюминии",
    "печать на чехлах",
    "печать фото",
    "индивидуальная печать",
    "персональные подарки",
    "печать в Ванадзоре",
    "подарки на заказ",
    "sublimation",
    "sublimation printing",
    "custom sublimation gifts",
    "mug sublimation",
    "t-shirt sublimation",
    "aluminum sublimation printing",
    "photo sublimation",
    "custom printing",
    "personalized gifts",
    "print studio",
    "vanadzor printing",
    "high quality sublimation",
  ],

  openGraph: {
    title: "Nuvia Print — Custom Gifts & Personalized Products",
    description:
      "Personalized mugs, T-shirts, aluminum prints, phone cases and more. Custom gifts with high-quality sublimation printing.",
    url: "https://nuviaprint.art",
    siteName: "Nuvia Print",
    images: [
      {
        url: "https://www.nuviaprint.art/opengraph-image.png",
        secureUrl: "https://nuviaprint.art/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Nuvia Print Preview",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nuvia Print — Custom Gifts & Personalized Products",
    description:
      "Personalized mugs, T-shirts, aluminum prints, phone cases and more.",
    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: [
      { url: "/icon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://nuviaprint.art",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          property="og:image"
          content="https://www.nuviaprint.art/opengraph-image.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://www.nuviaprint.art/opengraph-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body>{children}</body>
    </html>
  );
}
