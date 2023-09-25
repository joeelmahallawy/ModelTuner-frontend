import { Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import Models from "../components/pages/models";
import Head from "next/head";
import { SessionObject } from "../utils/interfaces";
import { SessionContext } from "../components/sessionProvider";
import { useContext } from "react";

const ModelsPage = () => {
  const [session, _]: [session: SessionObject, _: any] =
    useContext(SessionContext);

  console.log(`SESSION FROM MODELS PAGE:`, session);
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
