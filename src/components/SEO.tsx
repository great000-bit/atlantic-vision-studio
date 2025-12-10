import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  structuredData?: object;
}

const defaultMeta = {
  siteName: "Atlantic Creators Company",
  title: "Atlantic Creators Company – Cinematic Media & Studio Production",
  description: "Full-service cinematic media production company. Photography, videography, documentaries, podcast studio, and event coverage. Premium quality for brands, tourism, and events.",
  keywords: "media production, video production, photography, documentary, podcast studio, event coverage, film production, cinematic content, brand content, tourism media, Atlantic Creators, content creation agency, professional videography, corporate video production",
  image: "https://www.theatlanticcreators.com/og-image.jpg",
  url: "https://www.theatlanticcreators.com",
  twitterHandle: "@AtlanticCreators",
};

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Atlantic Creators Company",
  "alternateName": "Atlantic Creators",
  "url": "https://www.theatlanticcreators.com",
  "logo": "https://www.theatlanticcreators.com/logo.png",
  "description": "Full-service cinematic media production company specializing in photography, videography, documentaries, podcast production, and event coverage.",
  "email": "theatlanticcreators@gmail.com",
  "sameAs": [
    "https://www.instagram.com/atlanticcreatorscompany/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "theatlanticcreators@gmail.com",
    "availableLanguage": ["English"]
  },
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  }
};

// Website Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Atlantic Creators Company",
  "url": "https://www.theatlanticcreators.com",
  "description": "Professional cinematic media production services including photography, videography, documentaries, and podcast studio.",
  "publisher": {
    "@type": "Organization",
    "name": "Atlantic Creators Company"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.theatlanticcreators.com/portfolio?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Local Business Schema
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Atlantic Creators Company",
  "image": "https://www.theatlanticcreators.com/og-image.jpg",
  "url": "https://www.theatlanticcreators.com",
  "email": "theatlanticcreators@gmail.com",
  "priceRange": "$$$",
  "description": "Premium cinematic media production company offering photography, videography, documentary filmmaking, podcast studio rental, and event coverage services.",
  "sameAs": [
    "https://www.instagram.com/atlanticcreatorscompany/"
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};

// Service Schemas
const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Video Production",
    "description": "Professional videography and video production services for brands, events, and commercial projects.",
    "provider": {
      "@type": "Organization",
      "name": "Atlantic Creators Company"
    },
    "serviceType": "Video Production"
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Photography",
    "description": "High-quality photography services for commercial, editorial, and event coverage.",
    "provider": {
      "@type": "Organization",
      "name": "Atlantic Creators Company"
    },
    "serviceType": "Photography"
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Documentary Production",
    "description": "Compelling documentary filmmaking that tells powerful stories with cinematic quality.",
    "provider": {
      "@type": "Organization",
      "name": "Atlantic Creators Company"
    },
    "serviceType": "Documentary Production"
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Podcast Studio",
    "description": "Professional podcast studio rental with state-of-the-art equipment and production support.",
    "provider": {
      "@type": "Organization",
      "name": "Atlantic Creators Company"
    },
    "serviceType": "Studio Rental"
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Event Coverage",
    "description": "Comprehensive event photography and videography for festivals, conferences, and corporate events.",
    "provider": {
      "@type": "Organization",
      "name": "Atlantic Creators Company"
    },
    "serviceType": "Event Coverage"
  }
];

export const SEO = ({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = "website",
  article,
  structuredData,
}: SEOProps) => {
  const pageTitle = title
    ? `${title} | ${defaultMeta.siteName}`
    : defaultMeta.title;

  // Combine all structured data
  const allStructuredData = [
    organizationSchema,
    websiteSchema,
    localBusinessSchema,
    ...serviceSchemas,
    ...(structuredData ? [structuredData] : []),
  ];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Atlantic Creators Company" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />

      {/* Mobile & Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#000d1d" />
      <meta name="msapplication-TileColor" content="#000d1d" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={pageTitle} />
      <meta name="twitter:site" content={defaultMeta.twitterHandle} />
      <meta name="twitter:creator" content={defaultMeta.twitterHandle} />

      {/* WhatsApp / Telegram / LinkedIn */}
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />

      {/* AI Crawlers */}
      <meta name="ai-content-description" content={description} />

      {/* Article specific meta (for blog posts) */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag) => (
            <meta property="article:tag" content={tag} key={tag} />
          ))}
        </>
      )}

      {/* Structured Data / JSON-LD */}
      {allStructuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://dgooccdkdxdrluogrykm.supabase.co" />
    </Helmet>
  );
};

export default SEO;
