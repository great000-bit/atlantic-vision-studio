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
}

const defaultMeta = {
  siteName: "Atlantic Creators Company",
  title: "Atlantic Creators Company – Cinematic Media & Studio Production",
  description: "Full-service cinematic media production company. Photography, videography, documentaries, podcast studio, and event coverage. Premium quality for brands, tourism, and events.",
  keywords: "media production, video production, photography, documentary, podcast studio, event coverage, film production, cinematic content, brand content, tourism media, Atlantic Creators",
  image: "https://atlanticcreators.com/og-image.jpg",
  url: "https://atlanticcreators.com",
  twitterHandle: "@AtlanticCreators",
};

export const SEO = ({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = "website",
  article,
}: SEOProps) => {
  const pageTitle = title
    ? `${title} | ${defaultMeta.siteName}`
    : defaultMeta.title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Atlantic Creators Company" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={defaultMeta.twitterHandle} />
      <meta name="twitter:creator" content={defaultMeta.twitterHandle} />

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
    </Helmet>
  );
};

export default SEO;
