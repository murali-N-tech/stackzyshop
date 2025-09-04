import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

// Set default props for pages that don't provide them
Meta.defaultProps = {
  title: 'Welcome To eCommerceShop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electronics',
};

export default Meta;