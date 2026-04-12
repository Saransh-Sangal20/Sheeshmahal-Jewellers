import { Helmet } from "react-helmet";

const DEFAULT_SITE_NAME = "Sheeshmahal Jewellers";
const DEFAULT_DESCRIPTION =
  "Sheeshmahal Jewellers is a trusted jewellery shop in Varanasi near Rani Sati Mandir, offering gold jewellery, diamond jewellery, silver designs, and bridal collections.";

export const Seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image = "https://images.unsplash.com/photo-1737515046830-1680d82e043c?crop=entropy&cs=srgb&fm=jpg&q=85",
  imageAlt = `${DEFAULT_SITE_NAME} jewellery showroom in Varanasi`,
  type = "website",
  locale = "en_IN",
  geoRegion = "IN-UP",
  geoPlacename = "Varanasi",
  geoPosition = "25.3271982;83.0032499",
  structuredData,
}) => {
  const pageTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME;
  const keywordList = Array.isArray(keywords) ? keywords.filter(Boolean) : [];
  const keywordContent = keywordList.join(", ");

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywordContent ? <meta name="keywords" content={keywordContent} /> : null}
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="author" content={DEFAULT_SITE_NAME} />
      <meta name="theme-color" content="#1c1917" />
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={geoPosition} />

      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {structuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      ) : null}
    </Helmet>
  );
};

export default Seo;