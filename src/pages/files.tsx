import { Title } from "@mantine/core";
import SidebarWrapper from "../components/dashboard/SidebarWrapper";
import ModelsPage from "../components/pages/models";
import FilesSection from "../components/pages/files";

const FilesPage = () => {
  return (
    <SidebarWrapper>
      <FilesSection />
    </SidebarWrapper>
  );
};

export default FilesPage;
