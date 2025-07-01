import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Private Hibachi Chef | In-Home Teppanyaki Catering | San Jose Bay Area",
  description = "Book a private hibachi chef for your backyard party! Mobile hibachi catering with live cooking show, flame tricks, and all-inclusive service. Serving San Jose, Bay Area, Sacramento, and San Francisco.",
  keywords = "private hibachi chef, hibachi catering near me, in-home hibachi chef, teppanyaki at home, backyard hibachi party, mobile hibachi chef, hibachi chef for hire, San Jose hibachi catering, Bay Area private chef",
  image = "/src/assets/My%20Hibachi%20logo.png",
  url = "https://myhibachichef.com",
  type = "website",
  author = "My Hibachi Chef",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  canonicalUrl,
  structuredData
}) => {
  const siteUrl = "https://myhibachichef.com";
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": fullUrl,
    "image": fullImageUrl,
    "publisher": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/src/assets/My%20Hibachi%20logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl || fullUrl} />
      
      {/* Robots Meta */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="My Hibachi Chef" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@MyHibachiChef" />
      <meta name="twitter:site" content="@MyHibachiChef" />
      
      {/* Additional SEO Meta */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="handheld-friendly" content="true" />
      <meta name="theme-color" content="#d4af37" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
