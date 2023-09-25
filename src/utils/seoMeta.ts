import React from "react";
import { NextSeoProps } from "next-seo";
import logo from "../../assets/logo-2.png";

const config = {
  author: "Youssef El Mahallawy",
  siteName: "ModelTuner",
  siteDescription: "All-in-one dashboard for fine-tuning ChatGPT.",
  defaultPageTitle: "ModelTuner",
  blogTitle: "AI fine-tuning platform",
  baseUrl: "www.modeltunerai.com",
  websiteLogo: logo.src,
};

type DataType = {
  title?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  slug?: string;
  publishDate?: string;
  modifiedDate?: string;
};

const getImage = (data: DataType = {}) => {
  if (data.imageUrl) {
    return [{ url: data.imageUrl, width: 600, height: 300, alt: data.title }];
  }

  if (data.slug) {
    return [
      {
        url: `/${data.slug}`,
        width: 600,
        height: 300,
        alt: data.title,
      },
    ];
  }

  return [
    {
      url: config.websiteLogo,
      width: 280,
      height: 280,
      alt: "AI fine-tuning platform",
    },
  ];
};

export function createSEOConfig(data: DataType = {}): NextSeoProps {
  const title = data.title || config.defaultPageTitle;
  const description = data.seoDescription
    ? data.seoDescription
    : config.siteDescription;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: data.canonicalUrl,
      title,
      description,
      images: getImage(data),
      site_name: config.siteName,
    },
  };
}
