import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  rem,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import HeaderMenu from "../components/Landing/headerMenu";
import HomePage from "../components/Landing/homeSection";
import FeaturesPage from "../components/Landing/featuresSection";
import GetStartedSection from "../components/Landing/getStartedSection";
import FooterSimple from "../components/Landing/footer";

export const colors = {
  landingPageGray: `#131415`,
};

const links = [
  {
    link: "#",
    label: "Overview",
  },
  {
    link: "/models",
    label: "Product",
  },
  {
    link: "mailto:youssef.elmahallawy01@gmail.com",
    label: "Contact",
  },
];

const IndexPage = () => {
  return (
    <Box sx={{ background: colors.landingPageGray }}>
      <HeaderMenu />
      <HomePage />
      <FeaturesPage />
      <GetStartedSection />
      <FooterSimple links={links} />
    </Box>
  );
};
export default IndexPage;
