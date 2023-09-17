import { Header, Title } from "@mantine/core";
const DashboardHeader = () => {
  return (
    <Header height={60} sx={{ display: "flex", justifyContent: "center" }}>
      <Title>AI training made easy!</Title>
    </Header>
  );
};
export default DashboardHeader;
