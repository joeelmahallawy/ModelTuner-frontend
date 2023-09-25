import { Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import Models from "../components/pages/models";
import Head from "next/head";

const ModelsPage = () => {
  return (
    <>
      <Head>
        <title>Models - ModelTuner</title>
      </Head>
      <SidebarWrapper>
        <Models />
      </SidebarWrapper>
    </>
  );
};

export default ModelsPage;
