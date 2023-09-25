import { Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import ModelsPage from "../components/pages/models";
import FilesSection from "../components/pages/files";
import Head from "next/head";

const FilesPage = () => {
  return (
    <>
      <Head>
        <title> Files – ModelTuner</title>
      </Head>
      <SidebarWrapper>
        <FilesSection />
      </SidebarWrapper>
    </>
  );
};

export default FilesPage;
